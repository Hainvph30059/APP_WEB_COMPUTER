/**
 * ========================================
 * AUTH GUARD - Bảo vệ các trang yêu cầu đăng nhập
 * ========================================
 * Kiểm tra authentication bằng cách gọi API /v1/users/me
 */

(function() {
    'use strict';

    var API_BASE_URL = 'http://localhost:8080/api';
    var CHECK_AUTH_ENDPOINT = '/v1/users/me';
    var REFRESH_TOKEN_ENDPOINT = '/v1/users/refresh-token';
    
    // Cache kết quả để tránh gọi API nhiều lần
    var authCheckCache = {
        result: null,
        timestamp: null,
        ttl: 5000 // Cache 5 giây
    };
    
    // Flag để tránh gọi refresh nhiều lần
    var isRefreshingToken = false;

    // Hàm refresh token
    function refreshToken(callback) {
        if (isRefreshingToken) {
            setTimeout(function() { refreshToken(callback); }, 100);
            return;
        }
        
        console.log('🔄 [AuthGuard] Token hết hạn → Refresh token');
        isRefreshingToken = true;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API_BASE_URL + REFRESH_TOKEN_ENDPOINT, true);
        xhr.withCredentials = true;
        
        xhr.onload = function() {
            isRefreshingToken = false;
            if (xhr.status === 200) {
                console.log('✅ [AuthGuard] Refresh token thành công');
                authCheckCache.result = null;
                authCheckCache.timestamp = null;
                callback(true);
            } else {
                console.error('❌ [AuthGuard] Refresh thất bại:', xhr.status);
                callback(false);
            }
        };
        
        xhr.onerror = function() {
            isRefreshingToken = false;
            console.error('❌ [AuthGuard] Network error khi refresh');
            callback(false);
        };
        
        xhr.send();
    }

    // Hàm kiểm tra authentication bằng API
    function checkAuthentication(callback, isRetry) {
        // Kiểm tra cache
        var now = Date.now();
        if (authCheckCache.result !== null && 
            authCheckCache.timestamp && 
            (now - authCheckCache.timestamp) < authCheckCache.ttl) {
            callback(authCheckCache.result);
            return;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API_BASE_URL + CHECK_AUTH_ENDPOINT, true);
        xhr.withCredentials = true; // Gửi cookie cùng request
        
        xhr.onload = function() {
            
            if (xhr.status === 200) {
                // Đã đăng nhập
                try {
                    var response = JSON.parse(xhr.responseText);
                    
                    // Kiểm tra structure: { code, result }
                    if (response.code === 1000 && response.result) {
                        var userData = response.result;
                        
                        // Lưu thông tin user vào sessionStorage
                        sessionStorage.setItem('currentUser', JSON.stringify(userData));
                        
                        // Cache kết quả
                        authCheckCache.result = true;
                        authCheckCache.timestamp = Date.now();
                        
                        callback(true);
                    } else {
                        console.error('❌ Response structure không đúng:', response);
                        callback(false);
                    }
                } catch (e) {
                    console.error('❌ Parse response lỗi:', e);
                    callback(false);
                }
            } else if (xhr.status === 410) {
                // Token hết hạn
                console.log('⏰ [AuthGuard] Token hết hạn (410)');
                
                if (!isRetry) {
                    refreshToken(function(success) {
                        if (success) {
                            console.log('✅ [AuthGuard] Retry check authentication');
                            checkAuthentication(callback, true);
                        } else {
                            console.log('❌ [AuthGuard] Refresh thất bại → Redirect login');
                            authCheckCache.result = false;
                            authCheckCache.timestamp = Date.now();
                            sessionStorage.removeItem('currentUser');
                            callback(false);
                        }
                    });
                } else {
                    console.log('❌ [AuthGuard] Đã retry nhưng vẫn lỗi');
                    authCheckCache.result = false;
                    authCheckCache.timestamp = Date.now();
                    sessionStorage.removeItem('currentUser');
                    callback(false);
                }
            } else if (xhr.status === 401 || xhr.status === 403) {       
                try {
                    var errorResponse = JSON.parse(xhr.responseText);
                    console.log('   Error:', errorResponse);
                } catch (e) {
                    // Ignore parse error
                }
                
                // Xóa cache
                authCheckCache.result = false;
                authCheckCache.timestamp = Date.now();
                sessionStorage.removeItem('currentUser');
                
                callback(false);
            } else {
                // Lỗi khác
                console.error('❌ API lỗi:', xhr.status, xhr.statusText);
                try {
                    var errorResponse = JSON.parse(xhr.responseText);
                    console.error('   Error response:', errorResponse);
                } catch (e) {
                    // Ignore parse error
                }
                callback(false);
            }
        };
        
        xhr.onerror = function() {
            console.error('❌ Network error - Không kết nối được API');
            callback(false);
        };
        
        xhr.send();
    }

    // Danh sách các trang yêu cầu đăng nhập
    var protectedPages = [
        'my-account.html',
        'checkout.html',
        'wishlist.html',
        'cart.html'
        // Thêm các trang khác cần bảo vệ ở đây
    ];

    // Danh sách các trang chỉ dành cho guest (chưa đăng nhập)
    var guestOnlyPages = [
        'login.html'
    ];

    // Kiểm tra trang hiện tại (lấy tên file từ URL)
    var currentPage = window.location.pathname.split('/').pop();
    var currentPath = window.location.pathname;
    
    console.log('═══════════════════════════════════════');
    console.log('🔍 AUTH GUARD CHECK');
    console.log('📍 Full Path:', currentPath);
    console.log('📄 Current Page:', currentPage);
    console.log('═══════════════════════════════════════');
    
    // Kiểm tra authentication và xử lý
    checkAuthentication(function(isAuthenticated) {
        console.log('🔐 Is Authenticated:', isAuthenticated);
        
        // Nếu đã đăng nhập và cố truy cập trang login
        if (guestOnlyPages.indexOf(currentPage) !== -1) {
            console.log('🚪 Đang ở trang Guest Only:', currentPage);
            
            if (isAuthenticated) {
                console.log('✅ Đã đăng nhập → Chặn truy cập trang login');
                console.log('🔄 Redirect về my-account.html');
                window.location.href = 'my-account.html';
                return;
            } else {
                console.log('👤 Chưa đăng nhập → Cho phép truy cập');
                // Remove loading state
                if (document.body) {
                    document.body.classList.remove('auth-checking');
                }
            }
        }
        
        // Nếu là trang được bảo vệ và chưa đăng nhập
        if (protectedPages.indexOf(currentPage) !== -1) {
            console.log('🔒 Đang ở trang Protected:', currentPage);
            
            if (!isAuthenticated) {
                console.log('❌ Chưa đăng nhập → Chặn truy cập');
                console.log('💾 Lưu URL hiện tại:', window.location.href);
                
                // Lưu URL hiện tại để redirect về sau khi login
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                
                console.log('🔄 Redirect về login.html');
                window.location.href = 'login.html';
            } else {
                console.log('✅ Đã đăng nhập → Cho phép truy cập');
                // Remove loading state - cho phép hiển thị trang
                if (document.body) {
                    document.body.classList.remove('auth-checking');
                }
            }
        } else if (guestOnlyPages.indexOf(currentPage) === -1) {
            console.log('🌐 Trang công khai, không cần kiểm tra');
            // Remove loading state
            if (document.body) {
                document.body.classList.remove('auth-checking');
            }
        }
    });

    // PUBLIC FUNCTION - Có thể gọi từ bên ngoài
    window.AuthGuard = {
        // Kiểm tra xem user đã đăng nhập chưa (callback)
        isAuthenticated: function(callback) {
            checkAuthentication(callback);
        },
        
        // Lấy thông tin user hiện tại từ sessionStorage
        getCurrentUser: function() {
            var userStr = sessionStorage.getItem('currentUser');
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    return null;
                }
            }
            return null;
        },
        
        // Các helper functions để lấy thông tin user
        getUserId: function() {
            var user = this.getCurrentUser();
            return user ? user.id : null;
        },
        
        getUserEmail: function() {
            var user = this.getCurrentUser();
            return user ? user.email : null;
        },
        
        getUserName: function() {
            var user = this.getCurrentUser();
            return user ? user.username : null;
        },
        
        getDisplayName: function() {
            var user = this.getCurrentUser();
            return user ? user.displayName : null;
        },
        
        getUserRole: function() {
            var user = this.getCurrentUser();
            return user ? user.role : null;
        },
        
        isUserActive: function() {
            var user = this.getCurrentUser();
            return user ? user.isActive : false;
        },
        
        // Kiểm tra role
        isClient: function() {
            return this.getUserRole() === 'client';
        },
        
        isAdmin: function() {
            return this.getUserRole() === 'admin';
        },
        
        // Require authentication hoặc redirect
        requireAuth: function(callback) {
            checkAuthentication(function(isAuthenticated) {
                if (!isAuthenticated) {
                    sessionStorage.setItem('redirectAfterLogin', window.location.href);
                    window.location.href = 'login.html';
                    if (callback) callback(false);
                } else {
                    if (callback) callback(true);
                }
            });
        },
        
        // Clear cache để force check lại
        clearCache: function() {
            authCheckCache.result = null;
            authCheckCache.timestamp = null;
            sessionStorage.removeItem('currentUser');
            console.log('🗑️ Đã xóa cache authentication');
        },
        
        // Logout và redirect về login
        logout: function() {
            console.log('🚪 Đang logout...');
            
            // Xóa cache và session
            this.clearCache();
            sessionStorage.clear();
            
            // Gọi API logout để xóa cookie
            if (window.angular) {
                var injector = angular.element(document.body).injector();
                if (injector) {
                    try {
                        var AuthService = injector.get('AuthService');
                        AuthService.logout().then(function() {
                            console.log('✅ Logout thành công');
                        }).catch(function(err) {
                            console.error('❌ Logout lỗi:', err);
                            window.location.href = 'login.html';
                        });
                    } catch (e) {
                        console.error('❌ Get AuthService lỗi:', e);
                        window.location.href = 'login.html';
                    }
                } else {
                    window.location.href = 'login.html';
                }
            } else {
                window.location.href = 'login.html';
            }
        },
        
        // Redirect về trang đã lưu hoặc my-account
        redirectAfterLogin: function() {
            var redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'my-account.html';
            }
        }
    };

})();
