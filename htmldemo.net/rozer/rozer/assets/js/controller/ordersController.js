(function() {
    'use strict';

    angular.module('HoangDuongApp').controller('ordersController', function($scope, $timeout, OrderService) {

        // ==================== INIT ====================
        $scope.orders = [];
        $scope.filteredOrders = [];
        $scope.selectedOrder = null;
        $scope.showDetailModal = false;
        
        $scope.loading = {
            orders: false,
            detail: false,
            canceling: false
        };

        $scope.filters = {
            status: 'all',
            search: ''
        };

        $scope.statusList = [
            { value: 'all', label: 'Tất cả đơn hàng', count: 0 },
            { value: 'pending', label: 'Chờ xác nhận', count: 0 },
            { value: 'confirmed', label: 'Đã xác nhận', count: 0 },
            { value: 'processing', label: 'Đang xử lý', count: 0 },
            { value: 'shipping', label: 'Đang giao', count: 0 },
            { value: 'delivered', label: 'Đã giao', count: 0 },
            { value: 'completed', label: 'Hoàn thành', count: 0 },
            { value: 'cancelled', label: 'Đã hủy', count: 0 }
        ];

        // ==================== LOAD DATA ====================
        
        $scope.loadOrders = function() {
            $scope.loading.orders = true;
            OrderService.getOrders()
                .then(function(orders) {
                    $scope.orders = orders || [];
                    $scope.updateStatusCounts();
                    $scope.applyFilters();
                })
                .catch(function(error) {
                    console.error('Error loading orders:', error);
                    $scope.showNotification('Không thể tải danh sách đơn hàng', 'error');
                })
                .finally(function() {
                    $scope.loading.orders = false;
                });
        };

        // ==================== FILTERS ====================
        
        $scope.filterByStatus = function(status) {
            $scope.filters.status = status;
            $scope.applyFilters();
        };

        $scope.applyFilters = function() {
            var filtered = $scope.orders;

            // Filter by status
            if ($scope.filters.status !== 'all') {
                filtered = filtered.filter(function(order) {
                    return order.status === $scope.filters.status;
                });
            }

            // Filter by search
            if ($scope.filters.search && $scope.filters.search.trim() !== '') {
                var searchTerm = $scope.filters.search.toLowerCase();
                filtered = filtered.filter(function(order) {
                    return order.orderNumber.toLowerCase().includes(searchTerm) ||
                           (order.shippingAddress && order.shippingAddress.recipientName.toLowerCase().includes(searchTerm));
                });
            }

            $scope.filteredOrders = filtered;
        };

        $scope.updateStatusCounts = function() {
            $scope.statusList.forEach(function(statusItem) {
                if (statusItem.value === 'all') {
                    statusItem.count = $scope.orders.length;
                } else {
                    statusItem.count = $scope.orders.filter(function(order) {
                        return order.status === statusItem.value;
                    }).length;
                }
            });
        };

        // ==================== ORDER DETAIL ====================
        
        $scope.viewOrderDetail = function(orderId) {
            if (!orderId) {
                $scope.showNotification('ID đơn hàng không hợp lệ', 'error');
                return;
            }
            
            $scope.loading.detail = true;
            $scope.showDetailModal = true;

            OrderService.getOrderById(orderId)
                .then(function(order) {
                    $scope.selectedOrder = order;
                })
                .catch(function(error) {
                    console.error('Error loading order detail:', error);
                    $scope.showNotification('Không thể tải chi tiết đơn hàng', 'error');
                    $scope.showDetailModal = false;
                })
                .finally(function() {
                    $scope.loading.detail = false;
                });
        };

        $scope.closeDetailModal = function() {
            $scope.showDetailModal = false;
            $scope.selectedOrder = null;
        };

        // ==================== ORDER ACTIONS ====================
        
        $scope.cancelOrder = function(orderId) {
            var reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
            
            if (!reason || reason.trim() === '') {
                return;
            }

            if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                return;
            }

            $scope.loading.canceling = true;
            OrderService.cancelOrder(orderId, reason)
                .then(function() {
                    $scope.showNotification('Đã hủy đơn hàng thành công', 'success');
                    $scope.loadOrders();
                    if ($scope.selectedOrder && $scope.selectedOrder.id === orderId) {
                        $scope.closeDetailModal();
                    }
                })
                .catch(function(error) {
                    console.error('Error canceling order:', error);
                    $scope.showNotification(error.message || 'Không thể hủy đơn hàng', 'error');
                })
                .finally(function() {
                    $scope.loading.canceling = false;
                });
        };

        // ==================== HELPERS ====================
        
        $scope.formatCurrency = function(amount) {
            return OrderService.formatCurrency(amount);
        };

        $scope.formatDate = function(dateString) {
            return OrderService.formatDate(dateString);
        };

        $scope.getStatusLabel = function(status) {
            return OrderService.getStatusLabel(status);
        };

        $scope.getStatusBadgeClass = function(status) {
            return OrderService.getStatusBadgeClass(status);
        };

        $scope.getPaymentStatusLabel = function(status) {
            return OrderService.getPaymentStatusLabel(status);
        };

        $scope.getPaymentMethodLabel = function(method) {
            var labels = {
                'COD': 'Thanh toán khi nhận hàng',
                'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
                'VNPAY': 'VNPay',
                'MOMO': 'MoMo'
            };
            return labels[method] || method;
        };

        $scope.getTotalItems = function(order) {
            if (!order || !order.items) return 0;
            return order.items.reduce(function(sum, item) {
                return sum + (item.quantity || 0);
            }, 0);
        };

        $scope.getFirstProductImage = function(order) {
            if (!order || !order.items || order.items.length === 0) {
                return 'assets/images/product-image/placeholder.png';
            }
            return order.items[0].imageUrl || 'assets/images/product-image/placeholder.png';
        };

        $scope.canCancelOrder = function(order) {
            return order && order.status === 'pending';
        };

        // ==================== TRACKING TIMELINE ====================
        
        $scope.getTrackingIcon = function(status) {
            var icons = {
                'pending': 'icon-clock',
                'confirmed': 'icon-check',
                'processing': 'icon-layers',
                'shipping': 'icon-truck',
                'delivered': 'icon-handbag',
                'completed': 'icon-trophy',
                'cancelled': 'icon-close'
            };
            return icons[status] || 'icon-info';
        };

        // ==================== NOTIFICATION ====================
        
        $scope.showNotification = function(message, type) {
            if (type === 'success') {
                alert('✓ ' + message);
            } else {
                alert('✗ ' + message);
            }
        };

        // ==================== INIT LOAD ====================
        
        $scope.loadOrders();

    });

})();
