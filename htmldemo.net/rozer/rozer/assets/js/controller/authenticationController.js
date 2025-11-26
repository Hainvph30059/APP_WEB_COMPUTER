/**
 * ========================================
 * AUTHENTICATION CONTROLLER
 * ========================================
 * Xử lý Login và Register
 */

angular.module('HoangDuongApp')
    .controller('LoginController', function($scope, AuthService, $window, $timeout) {
        console.log('🔐 LoginController initialized');
        
        // ============================================
        // KHỞI TẠO DỮ LIỆU
        // ============================================
        $scope.loginData = {
            email: '',
            password: ''
        };
        
        $scope.registerData = {
            email: '',
            password: '',
            confirmPassword: ''
        };

        $scope.isLoading = false;
        $scope.errorMessage = '';
        $scope.successMessage = '';

        // ============================================
        // ĐĂNG NHẬP
        // ============================================
        $scope.login = function() {
            console.log('🔄 Đang xử lý login...');
            
            // Reset messages
            $scope.errorMessage = '';
            $scope.successMessage = '';
            $scope.isLoading = true;

            AuthService.login($scope.loginData.email, $scope.loginData.password)
                .then(function(response) {
                    console.log('✅ Login thành công:', response);
                    $scope.successMessage = 'Đăng nhập thành công! Đang chuyển hướng...';
                    
                    // Clear cache của Auth Guard để force check lại
                    if ($window.AuthGuard) {
                        $window.AuthGuard.clearCache();
                    }
                    
                    // Redirect về trang được lưu hoặc my-account sau 1 giây
                    $timeout(function() {
                        var redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                        if (redirectUrl) {
                            sessionStorage.removeItem('redirectAfterLogin');
                            $window.location.href = redirectUrl;
                        } else {
                            $window.location.href = 'my-account.html';
                        }
                    }, 1000);
                })
                .catch(function(error) {
                    console.error('❌ Login thất bại:', error);
                    
                    // Xử lý các loại lỗi khác nhau
                    if (error.status === 401) {
                        $scope.errorMessage = 'Email hoặc mật khẩu không đúng!';
                    } else if (error.status === 403) {
                        $scope.errorMessage = 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email!';
                    } else if (error.status === 0) {
                        $scope.errorMessage = 'Không thể kết nối đến server!';
                    } else {
                        $scope.errorMessage = error.data?.message || 'Đăng nhập thất bại! Vui lòng thử lại.';
                    }
                })
                .finally(function() {
                    $scope.isLoading = false;
                });
        };

        // ============================================
        // ĐĂNG KÝ
        // ============================================
        $scope.register = function() {
            console.log('🔄 Đang xử lý register...');
            
            // Kiểm tra mật khẩu khớp
            if ($scope.registerData.password !== $scope.registerData.confirmPassword) {
                $scope.errorMessage = 'Mật khẩu xác nhận không khớp!';
                return;
            }

            // Kiểm tra độ dài mật khẩu
            if ($scope.registerData.password.length < 6) {
                $scope.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự!';
                return;
            }

            // Reset messages
            $scope.errorMessage = '';
            $scope.successMessage = '';
            $scope.isLoading = true;

            AuthService.register($scope.registerData.email, $scope.registerData.password)
                .then(function(response) {
                    console.log('✅ Register thành công:', response);
                    
                    $scope.successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.';
                    
                    // Reset form
                    $scope.registerData = {
                        email: '',
                        password: '',
                        confirmPassword: ''
                    };
                    
                    // Chuyển về tab login sau 3 giây
                    $timeout(function() {
                        // Trigger click vào tab login
                        var loginTab = document.querySelector('a[href="#lg1"]');
                        if (loginTab) {
                            loginTab.click();
                        }
                        $scope.successMessage = '';
                    }, 3000);
                })
                .catch(function(error) {
                    console.error('❌ Register thất bại:', error);
                    
                    // Xử lý các loại lỗi
                    if (error.status === 409) {
                        $scope.errorMessage = 'Email đã được đăng ký!';
                    } else if (error.status === 400) {
                        $scope.errorMessage = error.data?.message || 'Dữ liệu không hợp lệ!';
                    } else if (error.status === 0) {
                        $scope.errorMessage = 'Không thể kết nối đến server!';
                    } else {
                        $scope.errorMessage = error.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
                    }
                })
                .finally(function() {
                    $scope.isLoading = false;
                });
        };

        // ============================================
        // TIỆN ÍCH
        // ============================================
        
        // Xóa thông báo lỗi khi chuyển tab
        $scope.clearMessages = function() {
            $scope.errorMessage = '';
            $scope.successMessage = '';
        };

        console.log('✅ LoginController sẵn sàng');
    });