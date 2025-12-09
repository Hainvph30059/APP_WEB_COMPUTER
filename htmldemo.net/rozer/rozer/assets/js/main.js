$(function () {
    "use strict";

    /*---------------------------
       Commons Variables
    ------------------------------ */ 
    var $window = $(window),
        $body = $("body");


     /*----------------------------------------
            Bootstrap dropdown               
    -------------------------------------------*/

    // Add slideDown animation to Bootstrap dropdown when expanding.

    $('.dropdown').on('show.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });
    // Add slideUp animation to Bootstrap dropdown when collapsing.
    $('.dropdown').on('hide.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
    });

    /*---------------------------
       Menu Fixed On Scroll Active
    ------------------------------ */
    $(window).scroll(function () {
        var window_top = $(window).scrollTop() + 1;
        if (window_top > 250) {
            $(".sticky-nav").addClass("menu_fixed animated fadeInDown");
        } else {
            $(".sticky-nav").removeClass("menu_fixed animated fadeInDown");
        }
    });

    /*---------------------------
       Menu menu-content
    ------------------------------ */

    $(".header-menu-vertical .menu-title").on("click", function (event) {
        $(".header-menu-vertical .menu-content").slideToggle(500);
    });

    $(".menu-content").each(function () {
        var $ul = $(this),
            $lis = $ul.find(".menu-item:gt(7)"),
            isExpanded = $ul.hasClass("expanded");
        $lis[isExpanded ? "show" : "hide"]();

        if ($lis.length > 0) {
            $ul.append(
                $(
                    '<li class="expand">' +
                        (isExpanded ? '<a href="javascript:;"><span><i class="ion-android-remove"></i>Close Categories</span></a>' : '<a href="javascript:;"><span><i class="ion-android-add"></i>More Categories</span></a>') +
                        "</li>"
                ).click(function (event) {
                    var isExpanded = $ul.hasClass("expanded");
                    event.preventDefault();
                    $(this).html(isExpanded ? '<a href="javascript:;"><span><i class="ion-android-add"></i>More Categories</span></a>' : '<a href="javascript:;"><span><i class="ion-android-remove"></i>Close Categories</span></a>');
                    $ul.toggleClass("expanded");
                    $lis.toggle(300);
                })
            );
        }
    });

    /*---------------------------------
        Off Canvas Function
    -----------------------------------*/
    (function () {
        var $offCanvasToggle = $(".offcanvas-toggle"),
            $offCanvas = $(".offcanvas"),
            $offCanvasOverlay = $(".offcanvas-overlay"),
            $mobileMenuToggle = $(".mobile-menu-toggle");
        $offCanvasToggle.on("click", function (e) {
            e.preventDefault();
            var $this = $(this),
                $target = $this.attr("href");
            $body.addClass("offcanvas-open");
            $($target).addClass("offcanvas-open");
            $offCanvasOverlay.fadeIn();
            if ($this.parent().hasClass("mobile-menu-toggle")) {
                $this.addClass("close");
            }
        });
        $(".offcanvas-close, .offcanvas-overlay").on("click", function (e) {
            e.preventDefault();
            $body.removeClass("offcanvas-open");
            $offCanvas.removeClass("offcanvas-open");
            $offCanvasOverlay.fadeOut();
            $mobileMenuToggle.find("a").removeClass("close");
        });
    })();

    /*----------------------------------
        Off Canvas Menu
    -----------------------------------*/
    function mobileOffCanvasMenu() {
        var $offCanvasNav = $(".offcanvas-menu, .overlay-menu"),
            $offCanvasNavSubMenu = $offCanvasNav.find(".sub-menu");

        /*Add Toggle Button With Off Canvas Sub Menu*/
        $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"></span>');

        /*Category Sub Menu Toggle*/
        $offCanvasNav.on("click", "li a, .menu-expand", function (e) {
            var $this = $(this);
            if ($this.attr("href") === "#" || $this.hasClass("menu-expand")) {
                e.preventDefault();
                if ($this.siblings("ul:visible").length) {
                    $this.parent("li").removeClass("active");
                    $this.siblings("ul").slideUp();
                    $this.parent("li").find("li").removeClass("active");
                    $this.parent("li").find("ul:visible").slideUp();
                } else {
                    $this.parent("li").addClass("active");
                    $this.closest("li").siblings("li").removeClass("active").find("li").removeClass("active");
                    $this.closest("li").siblings("li").find("ul:visible").slideUp();
                    $this.siblings("ul").slideDown();
                }
            }
        });
    }
    mobileOffCanvasMenu();

    /*------------------------------
            Hero Slider
    -----------------------------------*/

    var swiper = new Swiper(".hero-slider", {
        spaceBetween: 30,
        speed: 750,
        loop: true,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    /*------------------------------
            Category Slider
    -----------------------------------*/
    var swiper = new Swiper(".category-slider", {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 750,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });

    /*------------------------------
            Feature Slider
    -----------------------------------*/

    var swiper = new Swiper(".feature-slider", {
        slidesPerView: 5,
        spaceBetween: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });

    /*------------------------------
            Feature Slider Two
    -----------------------------------*/

    var swiper = new Swiper(".feature-slider-two", {
        slidesPerView: 6,
        spaceBetween: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
            1300: {
                slidesPerView: 6,
            },
        },
    });

    /*------------------------------
            Hot Deal Slider
    -----------------------------------*/
    var swiper = new Swiper(".deal-slider", {
        slidesPerView: 2,
        spaceBetween: 30,
        speed: 750,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            },
            1200: {
                slidesPerView: 2,
            },
        },
    });

    /*------------------------------
            Feature-2 Slider
    -----------------------------------*/

    var swiper = new Swiper(".feature-slider-2", {
        slidesPerView: 4,
        spaceBetween: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });

    /*------------------------------
            Brand Slider
    -----------------------------------*/

    var swiper = new Swiper(".brand-slider", {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 750,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });

    /*------------------------------
            Recent Slider
    -----------------------------------*/

    var swiper = new Swiper(".recent-slider", {
        slidesPerView: 4,
        spaceBetween: 30,
        speed: 750,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });

    /*------------------------------
            Recent Slider Two
    -----------------------------------*/
    var swiper = new Swiper(".recent-slider-two", {
        slidesPerView: 3,
        spaceBetween: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
            992: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    /*------------------------------
            Single Product Slider
    -----------------------------------*/
    var swiper = new Swiper(".single-product-slider", {
        slidesPerView: 4,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            478: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });

    /*----------------------------  
        All Category toggle  
     ------------------------------*/

    $(".category-toggle").click(function () {
        $(".category-menu").slideToggle("slow");
    });
    $(".menu-item-has-children-1").click(function () {
        $(".category-mega-menu-1").slideToggle("slow");
    });
    $(".menu-item-has-children-2").click(function () {
        $(".category-mega-menu-2").slideToggle("slow");
    });
    $(".menu-item-has-children-3").click(function () {
        $(".category-mega-menu-3").slideToggle("slow");
    });
    $(".menu-item-has-children-4").click(function () {
        $(".category-mega-menu-4").slideToggle("slow");
    });
    $(".menu-item-has-children-5").click(function () {
        $(".category-mega-menu-5").slideToggle("slow");
    });
    $(".menu-item-has-children-6").click(function () {
        $(".category-mega-menu-6").slideToggle("slow");
    });

    /*-----------------------------  
              Category more toggle  
        -------------------------------*/

    $(".category-menu li.hidden").hide();
    $("#more-btn").on("click", function (e) {
        e.preventDefault();
        $(".category-menu li.hidden").toggle(500);
        var htmlAfter = '<i class="ion-ios-minus-empty" aria-hidden="true"></i> Less Categories';
        var htmlBefore = '<i class="ion-ios-plus-empty" aria-hidden="true"></i> More Categories';

        if ($(this).html() == htmlBefore) {
            $(this).html(htmlAfter);
        } else {
            $(this).html(htmlBefore);
        }
    });

    /*---------------------
        Countdown
    --------------------- */
    $("[data-countdown]").each(function () {
        var $this = $(this),
            finalDate = $(this).data("countdown");
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('<span class="cdown day">%-D <p>Days</p></span> <span class="cdown hour">%-H <p>Hours</p></span> <span class="cdown minutes">%M <p>Mins</p></span> <span class="cdown second">%S <p>Sec</p></span>'));
        });
    });

    /*---------------------
        Scroll Up
    --------------------- */
    $.scrollUp({
        scrollText: '<i class="ion-android-arrow-up"></i>',
        easingType: "linear",
        scrollSpeed: 900,
        animation: "fade",
    });

    /*----------------------------
        Cart Plus Minus Button
    ------------------------------ */
    var CartPlusMinus = $(".cart-plus-minus");
    CartPlusMinus.prepend('<div class="dec qtybutton">-</div>');
    CartPlusMinus.append('<div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() === "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find("input").val(newVal);
    });

    /*--------------------------
            Product Zoom
    ---------------------------- */
    $(document).ready(function() {
        $('#zoom_01').elevateZoom({
            zoomType: "lens", 
            lensShape: "round", 
            lensSize: 250,  // Tăng hoặc giảm kích thước lens theo yêu cầu
            borderSize: 1,
            borderColour: "#000",
            scrollZoom: false, // Loại bỏ scroll zoom
            zoomLevel: 3,  // Tăng tỷ lệ zoom để làm cho hình ảnh to hơn trong lens
            responsive: true
        });
    
        // Thay đổi ảnh zoom khi nhấp vào thumbnail
        $("#gallery a").on("click", function(e) {
            e.preventDefault();
            var ez = $('#zoom_01').data('elevateZoom');
            ez.swaptheimage($(this).data("image"), $(this).data("zoom-image"));
        });
    });
    
    /*------------------------------
            Single Product Slider
    -----------------------------------*/
    var swiper = new Swiper(".product-dec-slider-2", {
        slidesPerView: 4,
        spaceBetween: 10,
        breakpoints: {
            0: {
                slidesPerView: 4,
            },
            478: {
                slidesPerView: 4,
            },
            576: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    }); 

    /*------------------------------
            Single Product Slider
    -----------------------------------*/
    var swiper = new Swiper(".product-dec-slider-3", {
        slidesPerView: 4,
        spaceBetween: 10,
        direction: 'vertical',
        breakpoints: {
            0: {
                slidesPerView: 4,
            },
            478: {
                slidesPerView: 4,
            },
            576: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });

      

    /*-----------------------------
        Blog Gallery Slider 
    -------------------------------- */
        var swiper = new Swiper(".blog-gallery", {
        slidesPerView:1,
        spaceBetween:0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    /*-------------------------------
        Create an account toggle
    ---------------------------------*/
    $(".checkout-toggle2").on("click", function () {
        $(".open-toggle2").slideToggle(1000);
    });

    $(".checkout-toggle").on("click", function () {
        $(".open-toggle").slideToggle(1000);
    });

    /*---------------------------
        Quick view Slider 
    ------------------------------ */
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs
      }
    });
        
});



// // main.js - Config chung cho toàn bộ ứng dụng
(function() {
    'use strict';

    // Tạo module chung cho app
    var app = angular.module('HoangDuongApp', []);

    // ✅ CONFIG TOÀN CỤC
    app.config(function($httpProvider) {
        // Tự động gửi cookies với mọi request
        $httpProvider.defaults.withCredentials = true;
        
        // Thêm interceptor xử lý authentication
        $httpProvider.interceptors.push('authInterceptor');
    });

    // ✅ CONSTANT - API Base URL
    app.constant('API_CONFIG', {
        BASE_URL: 'http://localhost:8080/api',
        ENDPOINTS: {
            LOGIN: '/v1/users/login',
            REGISTER: '/v1/users/register',
            LOGOUT: '/v1/users/logout',
            REFRESH_TOKEN: '/v1/users/refresh-token',
            VERYFY_ACCOUNT: '/v1/users/verify',
            USER_UPDATE: '/v1/users/update',
            USER_ME: '/v1/users/me', // API lấy thông tin user hiện tại
            PRODUCTS: '/product',
            PRODUCT_TYPES: '/product-type',
            CART: '/cart'
        }
    });

    // ✅ AUTH INTERCEPTOR - Xử lý tự động token hết hạn
    app.factory('authInterceptor', function($q, $injector, $window) {
        var isRefreshing = false;
        var failedQueue = [];

        function processQueue(error, token) {
            failedQueue.forEach(function(prom) {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(token);
                }
            });
            failedQueue = [];
        }

        return {
            // Xử lý lỗi response
            responseError: function(rejection) {
                var $http = $injector.get('$http');
                var API_CONFIG = $injector.get('API_CONFIG');

                // Nếu token hết hạn (410)
                if (rejection.status === 410 && rejection.config && !rejection.config.__isRetryRequest) {
                    if (isRefreshing) {
                        // Đang refresh, đợi kết quả
                        return $q(function(resolve, reject) {
                            failedQueue.push({ resolve: resolve, reject: reject });
                        }).then(function() {
                            return $http(rejection.config);
                        });
                    }

                    isRefreshing = true;
                    rejection.config.__isRetryRequest = true;

                    // Gọi refresh token
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.REFRESH_TOKEN,
                        withCredentials: true
                    }).then(function(response) {
                        isRefreshing = false;
                        processQueue(null, true);
                        // Thử lại request ban đầu
                        return $http(rejection.config);
                    }).catch(function(error) {
                        isRefreshing = false;
                        processQueue(error, null);
                        // Redirect về login
                        $window.location.href = '/rozer/login.html';
                        return $q.reject(error);
                    });
                }

                // Nếu chưa login (401)
                if (rejection.status === 401) {
                    var currentPath = $window.location.pathname;
                    // Không redirect nếu đang ở trang public
                    if (!currentPath.includes('login.html') && 
                        !currentPath.includes('index.html') && 
                        !currentPath.includes('listProduct.html') &&
                        !currentPath.includes('single-product.html')) {
                        $window.location.href = '/rozer/login.html';
                    }
                }

                return $q.reject(rejection);
            }
        };
    });

    // ✅ AUTH SERVICE - Quản lý authentication
    app.service('AuthService', function($http, API_CONFIG, $window) {
        var self = this;

        // Login
        this.login = function(email, password) {
            return $http.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN, {
                email: email,
                password: password
            }).then(function(response) {
                console.log('Login thành công');
                return response.data;
            });
        };

        // Register
        this.register = function(email, password) {
            return $http.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.REGISTER, {
                email: email,
                password: password
            }).then(function(response) {
                console.log('Đăng ký thành công');
                return response.data;
            });
        };

        // Logout
        this.logout = function() {
            return $http.delete(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGOUT)
                .then(function(response) {
                    $window.location.href = '/rozer/login.html';
                    return response.data;
                });
        };

        // Check if logged in (có thể gọi API /me hoặc check cookie)
        this.isAuthenticated = function() {
            // Có thể check cookie hoặc gọi API
            return document.cookie.indexOf('accessToken') !== -1;
        };
    });

    // ✅ HTTP SERVICE - Wrapper cho $http với API base URL
    app.service('HttpService', function($http, API_CONFIG) {
        var self = this;

        this.get = function(endpoint, params) {
            return $http.get(API_CONFIG.BASE_URL + endpoint, {
                params: params
            });
        };

        this.post = function(endpoint, data) {
            return $http.post(API_CONFIG.BASE_URL + endpoint, data);
        };

        this.put = function(endpoint, data) {
            return $http.put(API_CONFIG.BASE_URL + endpoint, data);
        };

        this.patch = function(endpoint, data) {
            return $http.patch(API_CONFIG.BASE_URL + endpoint, data);
        };

        this.delete = function(endpoint) {
            return $http.delete(API_CONFIG.BASE_URL + endpoint);
        };
    });

    // ✅ CART SERVICE - Quản lý giỏ hàng
    app.service('CartService', function(HttpService) {
        var self = this;
        var cart = null;

        // Lấy giỏ hàng từ API
        this.getCart = function() {
            return HttpService.get('/cart').then(function(response) {
                if (response.data.code === 1000) {
                    cart = response.data.result;
                    return cart;
                }
                return null;
            });
        };

        // Thêm vào giỏ hàng
        this.addToCart = function(productId, quantity) {
            return HttpService.post('/cart', {
                productId: productId,
                quantity: quantity || 1
            }).then(function(response) {
                if (response.data.code === 1000) {
                    cart = response.data.result;
                    return cart;
                }
                throw new Error(response.data.message || 'Add to cart failed');
            });
        };

        // Xóa sản phẩm khỏi giỏ hàng (dùng productId)
        this.removeFromCart = function(productId) {
            return HttpService.delete('/cart/' + productId).then(function(response) {
                if (response.data.code === 1000) {
                    cart = response.data.result;
                    return cart;
                }
                throw new Error(response.data.message || 'Remove from cart failed');
            });
        };

        // Cập nhật số lượng sản phẩm (dùng productId)
        this.updateQuantity = function(productId, quantity) {
            return HttpService.put('/cart/' + productId + '?quantity=' + quantity).then(function(response) {
                if (response.data.code === 1000) {
                    cart = response.data.result;
                    return cart;
                }
                throw new Error(response.data.message || 'Update quantity failed');
            });
        };

        // Xóa toàn bộ giỏ hàng
        this.clearCart = function() {
            return HttpService.delete('/cart').then(function(response) {
                if (response.data.code === 1000) {
                    cart = null;
                    return true;
                }
                throw new Error(response.data.message || 'Clear cart failed');
            });
        };

        // Lấy số lượng sản phẩm trong giỏ hàng từ API
        this.getCartCount = function() {
            return HttpService.get('/cart/count').then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                return 0;
            }).catch(function(error) {
                console.error('Error getting cart count:', error);
                return 0;
            });
        };

        // Lấy số lượng item trong giỏ (từ cache)
        this.getCartItemsCount = function() {
            return cart ? cart.totalItems : 0;
        };

        // Lấy tổng giá trị giỏ hàng
        this.getTotalPrice = function() {
            return cart ? cart.totalPrice : 0;
        };

        // Lấy cart hiện tại (đã cache)
        this.getCurrentCart = function() {
            return cart;
        };
    });

    // ✅ SHIPPING ADDRESS SERVICE - Quản lý địa chỉ giao hàng
    app.service('ShippingAddressService', function(HttpService) {
        var self = this;

        // Lấy danh sách địa chỉ của user
        this.getAddresses = function() {
            return HttpService.get('/shipping-addresses').then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to get addresses');
            });
        };

        // Tạo địa chỉ mới
        this.createAddress = function(addressData) {
            return HttpService.post('/shipping-addresses', addressData).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to create address');
            });
        };

        // Cập nhật địa chỉ
        this.updateAddress = function(id, addressData) {
            return HttpService.put('/shipping-addresses/' + id, addressData).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to update address');
            });
        };

        // Xóa địa chỉ
        this.deleteAddress = function(id) {
            return HttpService.delete('/shipping-addresses/' + id).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to delete address');
            });
        };

        // Đặt địa chỉ mặc định
        this.setDefaultAddress = function(id) {
            return HttpService.patch('/shipping-addresses/' + id + '/default', null).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to set default address');
            });
        };

        // Lấy danh sách tỉnh/thành phố
        this.getProvinces = function() {
            return HttpService.get('/ghn/provinces').then(function(response) {
                if (response.data.code === 1000) {
                    var result = response.data.result;
                    // Nếu result là object chứa array data, lấy array đó
                    if (result && typeof result === 'object' && !Array.isArray(result)) {
                        if (result.data && Array.isArray(result.data)) {
                            return result.data;
                        } else if (result.provinces && Array.isArray(result.provinces)) {
                            return result.provinces;
                        }
                    }
                    // Nếu result đã là array
                    if (Array.isArray(result)) {
                        return result;
                    }
                    return [];
                }
                throw new Error(response.data.message || 'Failed to get provinces');
            });
        };

        // Lấy danh sách quận/huyện theo tỉnh
        this.getDistricts = function(provinceId) {
            return HttpService.get('/ghn/districts', { provinceId: provinceId }).then(function(response) {
                if (response.data.code === 1000) {
                    var result = response.data.result;
                    // Nếu result là object chứa array data
                    if (result && typeof result === 'object' && !Array.isArray(result)) {
                        if (result.data && Array.isArray(result.data)) {
                            return result.data;
                        } else if (result.districts && Array.isArray(result.districts)) {
                            return result.districts;
                        }
                    }
                    // Nếu result đã là array
                    if (Array.isArray(result)) {
                        return result;
                    }
                    return [];
                }
                throw new Error(response.data.message || 'Failed to get districts');
            });
        };

        // Lấy danh sách phường/xã theo quận
        this.getWards = function(districtId) {
            return HttpService.get('/ghn/wards', { districtId: districtId }).then(function(response) {
                if (response.data.code === 1000) {
                    var result = response.data.result;
                    // Nếu result là object chứa array data
                    if (result && typeof result === 'object' && !Array.isArray(result)) {
                        if (result.data && Array.isArray(result.data)) {
                            return result.data;
                        } else if (result.wards && Array.isArray(result.wards)) {
                            return result.wards;
                        }
                    }
                    // Nếu result đã là array
                    if (Array.isArray(result)) {
                        return result;
                    }
                    return [];
                }
                throw new Error(response.data.message || 'Failed to get wards');
            });
        };
    });

    // ✅ ORDER SERVICE - Quản lý đơn hàng
    app.service('OrderService', function(HttpService) {
        var self = this;

        // Tính phí vận chuyển
        this.calculateShippingFee = function(shippingAddressId, subtotal) {
            return HttpService.post('/orders/calculate-shipping-fee', {
                shippingAddressId: shippingAddressId,
                subtotal: subtotal
            }).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to calculate shipping fee');
            });
        };

        // Tạo đơn hàng mới
        this.createOrder = function(orderData) {
            return HttpService.post('/orders', orderData).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to create order');
            });
        };

        // Lấy danh sách đơn hàng
        this.getOrders = function() {
            return HttpService.get('/orders').then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result || [];
                }
                throw new Error(response.data.message || 'Failed to get orders');
            });
        };

        // Lấy chi tiết đơn hàng
        this.getOrderById = function(orderId) {
            return HttpService.get('/orders/' + orderId).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to get order details');
            });
        };

        // Hủy đơn hàng (chỉ khi status = pending)
        this.cancelOrder = function(orderId, reason) {
            return HttpService.post('/orders/' + orderId + '/cancel', { reason: reason }).then(function(response) {
                if (response.data.code === 1000) {
                    return response.data.result;
                }
                throw new Error(response.data.message || 'Failed to cancel order');
            });
        };

        // Helper: Format currency
        this.formatCurrency = function(amount) {
            if (!amount) return '0₫';
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        };

        // Helper: Format date
        this.formatDate = function(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleString('vi-VN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Helper: Get status label
        this.getStatusLabel = function(status) {
            var labels = {
                'pending': 'Chờ xác nhận',
                'confirmed': 'Đã xác nhận',
                'processing': 'Đang xử lý',
                'shipping': 'Đang giao',
                'delivered': 'Đã giao',
                'completed': 'Hoàn thành',
                'cancelled': 'Đã hủy'
            };
            return labels[status] || status;
        };

        // Helper: Get status badge class
        this.getStatusBadgeClass = function(status) {
            var classes = {
                'pending': 'badge-warning',
                'confirmed': 'badge-info',
                'processing': 'badge-primary',
                'shipping': 'badge-purple',
                'delivered': 'badge-success',
                'completed': 'badge-success',
                'cancelled': 'badge-danger'
            };
            return classes[status] || 'badge-secondary';
        };

        // Helper: Get payment status label
        this.getPaymentStatusLabel = function(status) {
            var labels = {
                'unpaid': 'Chưa thanh toán',
                'paid': 'Đã thanh toán',
                'refunded': 'Đã hoàn tiền'
            };
            return labels[status] || status;
        };
    });

})();
