// verificationController.js - Controller xử lý xác thực tài khoản
(function() {
    'use strict';

    angular.module('HoangDuongApp')
        .controller('VerificationController', VerificationController);

    VerificationController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', 'API_CONFIG'];

    function VerificationController($scope, $http, $window, $timeout, $location, API_CONFIG) {
        console.log('VerificationController khởi tạo');

        // Khởi tạo các biến
        $scope.status = 'loading'; // loading, success, error, invalid
        $scope.errorMessage = '';
        $scope.countdown = 5; // Đếm ngược 5 giây trước khi redirect

        // Lấy parameters từ URL
        function getUrlParameters() {
            var search = $window.location.search;
            var params = {};
            
            if (search) {
                // Loại bỏ dấu ? ở đầu
                search = search.substring(1);
                
                // Tách các parameters
                var pairs = search.split('&');
                pairs.forEach(function(pair) {
                    var parts = pair.split('=');
                    params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
                });
            }
            
            return params;
        }

        // Xác thực tài khoản
        function verifyAccount(email, token) {
            console.log('Đang gọi API xác thực với email:', email);

            $http({
                method: 'PUT',
                url: API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.VERYFY_ACCOUNT,
                data: {
                    email: email,
                    token: token
                },
                withCredentials: true
            })
            .then(function(response) {
                console.log('Xác thực thành công:', response.data);
                $scope.status = 'success';
                
                // Đếm ngược và redirect
                startCountdown();
            })
            .catch(function(error) {
                console.error('Xác thực thất bại:', error);
                $scope.status = 'error';
                
                // Xử lý các loại lỗi khác nhau
                if (error.status === 404) {
                    $scope.errorMessage = 'Không tìm thấy tài khoản với email này.';
                } else if (error.status === 406) {
                    // 406 NOT_ACCEPTABLE
                    var message = error.data && error.data.message ? error.data.message : '';
                    
                    if (message.includes('already active')) {
                        $scope.errorMessage = 'Tài khoản của bạn đã được kích hoạt trước đó. Vui lòng đăng nhập.';
                    } else if (message.includes('invalid')) {
                        $scope.errorMessage = 'Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.';
                    } else {
                        $scope.errorMessage = 'Không thể xác thực tài khoản. ' + message;
                    }
                } else if (error.status === 400) {
                    $scope.errorMessage = 'Thông tin xác thực không hợp lệ.';
                } else if (error.status === 0) {
                    $scope.errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
                } else {
                    $scope.errorMessage = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
                }
            });
        }

        // Đếm ngược trước khi redirect
        function startCountdown() {
            var countdownTimer = $timeout(function tick() {
                $scope.countdown--;
                
                if ($scope.countdown > 0) {
                    countdownTimer = $timeout(tick, 1000);
                } else {
                    // Redirect về trang login
                    $window.location.href = 'login.html';
                }
            }, 1000);
        }

        // Khởi tạo khi controller load
        function init() {
            var params = getUrlParameters();
            var email = params.email;
            var token = params.token;

            console.log('Parameters từ URL:', params);

            // Kiểm tra xem có đầy đủ parameters không
            if (!email || !token) {
                console.error('Thiếu email hoặc token trong URL');
                $scope.status = 'invalid';
                return;
            }

            // Gọi API xác thực
            verifyAccount(email, token);
        }

        // Chạy init khi controller load
        init();
    }
})();
