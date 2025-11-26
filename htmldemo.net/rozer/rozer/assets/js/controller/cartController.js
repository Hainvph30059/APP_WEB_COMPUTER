/**
 * ========================================
 * CART CONTROLLER - Quản lý giỏ hàng
 * ========================================
 */

angular.module('HoangDuongApp')
    .controller('CartController', function($scope, CartService, $window) {
        console.log('🛒 CartController initialized');

        // Khởi tạo dữ liệu
        $scope.cart = null;
        $scope.loading = true;
        $scope.error = null;

        // Lấy giỏ hàng khi load trang
        $scope.loadCart = function() {
            $scope.loading = true;
            $scope.error = null;

            CartService.getCart()
                .then(function(cart) {
                    $scope.cart = cart;
                    console.log('✅ Load cart thành công:', cart);
                })
                .catch(function(error) {
                    console.error('❌ Load cart lỗi:', error);
                    $scope.error = 'Không thể tải giỏ hàng. Vui lòng thử lại.';
                    $scope.cart = {
                        items: [],
                        totalItems: 0,
                        totalPrice: 0
                    };
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        // Cập nhật số lượng
        $scope.updateQuantity = function(item, newQuantity) {
            if (newQuantity < 1) {
                newQuantity = 1;
            }

            var oldQuantity = item.quantity;
            item.quantity = newQuantity; // Optimistic update
            item.totalPrice = item.price * newQuantity;

            CartService.updateQuantity(item.productId, newQuantity)
                .then(function(cart) {
                    $scope.cart = cart;
                    console.log('✅ Cập nhật số lượng thành công');
                })
                .catch(function(error) {
                    console.error('❌ Cập nhật số lượng lỗi:', error);
                    // Rollback
                    item.quantity = oldQuantity;
                    item.totalPrice = item.price * oldQuantity;
                    alert('Không thể cập nhật số lượng. Vui lòng thử lại.');
                });
        };

        // Tăng số lượng
        $scope.increaseQuantity = function(item) {
            $scope.updateQuantity(item, item.quantity + 1);
        };

        // Giảm số lượng
        $scope.decreaseQuantity = function(item) {
            if (item.quantity > 1) {
                $scope.updateQuantity(item, item.quantity - 1);
            }
        };

        // Xóa sản phẩm khỏi giỏ
        $scope.removeItem = function(item) {
            if (!confirm('Bạn có chắc muốn xóa "' + item.name + '" khỏi giỏ hàng?')) {
                return;
            }

            CartService.removeFromCart(item.productId)
                .then(function(cart) {
                    $scope.cart = cart;
                    console.log('✅ Xóa sản phẩm thành công');
                })
                .catch(function(error) {
                    console.error('❌ Xóa sản phẩm lỗi:', error);
                    alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
                });
        };

        // Xóa toàn bộ giỏ hàng
        $scope.clearCart = function() {
            if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                return;
            }

            CartService.clearCart()
                .then(function() {
                    $scope.cart = {
                        items: [],
                        totalItems: 0,
                        totalPrice: 0
                    };
                    console.log('✅ Xóa giỏ hàng thành công');
                })
                .catch(function(error) {
                    console.error('❌ Xóa giỏ hàng lỗi:', error);
                    alert('Không thể xóa giỏ hàng. Vui lòng thử lại.');
                });
        };

        // Tiếp tục mua hàng
        $scope.continueShopping = function() {
            $window.location.href = '../../../index.html';
        };

        // Thanh toán
        $scope.proceedToCheckout = function() {
            if (!$scope.cart || !$scope.cart.items || $scope.cart.items.length === 0) {
                alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
                return;
            }
            $window.location.href = 'checkout.html';
        };

        // Format giá tiền
        $scope.formatPrice = function(price) {
            if (!price) return '0';
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        // Kiểm tra giỏ hàng rỗng
        $scope.isCartEmpty = function() {
            return !$scope.cart || !$scope.cart.items || $scope.cart.items.length === 0;
        };

        // Load giỏ hàng khi khởi tạo
        $scope.loadCart();
    });
