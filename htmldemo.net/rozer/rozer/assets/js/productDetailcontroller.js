// Sử dụng module HoangDuongApp đã được định nghĩa trong main.js
angular.module('HoangDuongApp')
.controller('productDetail', function ($scope, $http, $sce, Products, CartService, OrderService, ShippingAddressService) {
    // Lấy tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    $scope.cartCount = 0; // Khởi tạo số lượng giỏ hàng
    
    // Lấy số lượng sản phẩm trong giỏ hàng
    $scope.loadCartCount = function() {
        CartService.getCartCount().then(function(count) {
            $scope.cartCount = count;
        });
    };
    
    // Gọi khi controller khởi tạo
    $scope.loadCartCount();
    
    // API base URL
    const apiBaseUrl = "http://localhost:8080/api/product/";
    
    // ========== 1. LẤY CHI TIẾT SẢN PHẨM ==========
    $scope.productDetails = {};
    $scope.trustedHtml = '';
    $scope.productFields = [];
    $scope.fieldDisplayNames = {};
    
    function loadProductDetail() {
        if (!productId) {
            console.error("Product ID không tồn tại");
            return;
        }
        
        const productDetailApi = apiBaseUrl + productId;
        
        $http.get(productDetailApi).then(
            function (response) {
                if (response.data && response.data.code === 1000) {
                    const product = response.data.result;
                    
                    // Lưu dữ liệu sản phẩm (API đã trả về đủ, không cần map)
                    $scope.productDetails = {
                        id: product.id,
                        Name: product.name,
                        Price: product.price,
                        Stock: product.stock,
                        Description: product.description,
                        ViewCount: product.viewCount,
                        ProductTypeName: product.productTypeName,
                        DateCreated: product.dateCreated,
                        ImageUrls: product.urls || [],
                        attributes: product.attributes || {}
                    };
                    
                    // Hiển thị HTML description
                    $scope.trustedHtml = $sce.trustAsHtml(product.description || '');
                    
                    // Lấy danh sách attributes để hiển thị
                    $scope.productFields = Object.keys(product.attributes || {});
                    
                    // Set ảnh đầu tiên làm ảnh chính
                    $scope.selectedImage = $scope.productDetails.ImageUrls[0];
                    
                    // Sau khi có ProductTypeName, load các sản phẩm liên quan
                    loadRelatedProducts();
                    loadMostViewedProducts();
                    
                } else {
                    console.error("API trả về lỗi:", response.data);
                }
            },
            function (error) {
                console.error("Lỗi khi gọi API chi tiết sản phẩm:", error);
            }
        );
    }
    
    // Hàm chọn ảnh - Đơn giản, chỉ cần đổi ảnh
    $scope.selectImage = function (image) {
        $scope.selectedImage = image;
    };
    
    // ========== 2. LẤY SẢN PHẨM LIÊN QUAN ==========
    $scope.listProduct = [];
    
    function loadRelatedProducts() {
        // Kiểm tra ProductTypeName đã có chưa
        if (!$scope.productDetails.ProductTypeName) {
            console.log("Chưa có ProductTypeName, chờ load product detail");
            return;
        }
        
        const relatedApi = apiBaseUrl + "product-type-name/" + $scope.productDetails.ProductTypeName + "?page=1&size=12";
        
        $http.get(relatedApi).then(
            function (response) {
                if (response.data && response.data.code === 1000) {
                    const products = response.data.result.data || [];
                    
                    $scope.listProduct = products.map(function(p) {
                        return {
                            id: p.id,
                            Name: p.name,
                            Price: p.price,
                            ImageUrls: p.urls || [],
                            productTypeName: p.productTypeName
                        };
                    });
                }
            },
            function (error) {
                console.error("Lỗi khi lấy sản phẩm liên quan:", error);
            }
        );
    }
    
    // ========== 3. LẤY TOP 20 SẢN PHẨM XEM NHIỀU ==========
    $scope.listMostViewedProduct = [];
    
    function loadMostViewedProducts() {
        // Kiểm tra ProductTypeName đã có chưa
        if (!$scope.productDetails.ProductTypeName) {
            console.log("Chưa có ProductTypeName, chờ load product detail");
            return;
        }
        
        const topViewApi = apiBaseUrl + `view-count/top?type=${$scope.productDetails.ProductTypeName}&limit=12`;
        
        $http.get(topViewApi).then(
            function (response) {
                if (response.data && response.data.code === 1000) {
                    const result = response.data.result;
                    const products = Array.isArray(result) ? result : (result.data || []);
                    
                    $scope.listMostViewedProduct = products.map(function(p) {
                        return {
                            id: p.id,
                            Name: p.name,
                            Price: p.price,
                            ImageUrls: p.urls || [],
                            productTypeName: p.productTypeName
                        };
                    });
                }
            },
            function (error) {
                console.error("Lỗi khi lấy top sản phẩm:", error);
            }
        );
    }
    
    // ========== 4. CÁC CHỨC NĂNG KHÁC ==========
    
    // Cập nhật view count
    $scope.updateViewCount = function (productId) {
        if (productId) {
            Products.ClickProduct(productId);
        }
    };
    
    // Quick view modal
    $scope.openQuickView = function (product) {
        $scope.selectedProduct = product;
    };
    
    $scope.clearSelectedProduct = function () {
        $scope.selectedProduct = null;
    };
    
    // Xem thêm sản phẩm
    $scope.showMore = function() {
        if ($scope.productDetails && $scope.productDetails.ProductTypeName) {
            localStorage.setItem('productType', $scope.productDetails.ProductTypeName);
            window.location.href = 'listProduct.html?type=' + $scope.productDetails.ProductTypeName;
        }
    };

    // Copy spec value to clipboard with fallback
    $scope.copySpec = function(field) {
        try {
            var val = '';
            if ($scope.productDetails && $scope.productDetails.attributes) {
                val = $scope.productDetails.attributes[field] || '';
            }
            if (!val) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(val).then(function() {
                    // optional: small feedback in console
                    console.log('Spec copied:', field, val);
                }).catch(function(err) {
                    console.error('Copy failed:', err);
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = val;
                // avoid scrolling to bottom
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); console.log('Spec copied (fallback):', field); } catch (e) { console.error(e); }
                document.body.removeChild(ta);
            }
        } catch (e) {
            console.error('copySpec error:', e);
        }
    };

    // Thêm vào giỏ hàng
    $scope.addToCart = function(productId, quantity, productName) {
        console.log('🛒 addToCart called with:', { productId, quantity, productName });
        
        if (!productId) {
            console.error('❌ Product ID is missing!');
            alert('Lỗi: Không tìm thấy ID sản phẩm');
            return;
        }
        
        if (!CartService) {
            console.error('❌ CartService is not available!');
            alert('Lỗi: Dịch vụ giỏ hàng không khả dụng');
            return;
        }
        
        console.log('📦 Calling CartService.addToCart...');
        CartService.addToCart(productId, quantity || 1)
            .then(function(cart) {
                console.log('✅ Thêm vào giỏ hàng thành công:', cart);
                
                var message = productName 
                    ? 'Đã thêm "' + productName + '" vào giỏ hàng!' 
                    : 'Đã thêm sản phẩm vào giỏ hàng!';
                
                alert(message);
                
                // Cập nhật số lượng giỏ hàng
                $scope.loadCartCount();
            })
            .catch(function(error) {
                console.error('❌ Lỗi thêm vào giỏ hàng:', error);
                alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
            });
    };
    
    // ========== BUY NOW - MUA NGAY ==========
    $scope.buyNowQuantity = 1;
    $scope.shippingAddresses = [];
    $scope.selectedAddressId = null;
    $scope.orderNote = '';
    $scope.selectedPaymentMethod = 'COD';
    $scope.isCreatingOrder = false;
    $scope.shippingFee = 0;
    $scope.isCalculatingShipping = false;
    
    // Tính phí vận chuyển
    $scope.calculateShipping = function(addressId) {
        if (!addressId) {
            $scope.shippingFee = 0;
            return;
        }
        
        $scope.isCalculatingShipping = true;
        var subtotal = $scope.calculateSubtotal();
        
        OrderService.calculateShippingFee(addressId, subtotal)
            .then(function(fee) {
                $scope.shippingFee = fee;
                $scope.isCalculatingShipping = false;
            })
            .catch(function(error) {
                console.error('❌ Lỗi tính phí ship:', error);
                $scope.shippingFee = 0;
                $scope.isCalculatingShipping = false;
            });
    };
    
    // Xử lý khi chọn địa chỉ
    $scope.onAddressSelected = function(addressId) {
        $scope.selectedAddressId = addressId;
        $scope.calculateShipping(addressId);
    };
    
    // Mở modal Buy Now
    $scope.openBuyNowModal = function() {
        if (!$scope.productDetails || !$scope.productDetails.id) {
            alert('Thông tin sản phẩm chưa được tải. Vui lòng thử lại.');
            return;
        }
        
        // Reset shipping fee
        $scope.shippingFee = 0;
        
        // Load danh sách địa chỉ
        ShippingAddressService.getAddresses()
            .then(function(addresses) {
                $scope.shippingAddresses = addresses;
                
                // Tìm địa chỉ mặc định
                var defaultAddress = addresses.find(function(addr) { return addr.isDefault; });
                if (defaultAddress) {
                    $scope.selectedAddressId = defaultAddress.id;
                    $scope.calculateShipping(defaultAddress.id);
                } else if (addresses.length > 0) {
                    $scope.selectedAddressId = addresses[0].id;
                    $scope.calculateShipping(addresses[0].id);
                }
                
                // Mở modal bằng Bootstrap 5
                var modal = new bootstrap.Modal(document.getElementById('buyNowModal'));
                modal.show();
            })
            .catch(function(error) {
                console.error('❌ Lỗi load địa chỉ:', error);
                alert('Không thể tải danh sách địa chỉ. Bạn cần đăng nhập và thêm địa chỉ giao hàng.');
            });
    };
    
    // Xác nhận mua hàng
    $scope.confirmBuyNow = function() {
        if (!$scope.selectedAddressId) {
            alert('Vui lòng chọn địa chỉ giao hàng!');
            return;
        }
        
        if ($scope.buyNowQuantity < 1) {
            alert('Số lượng phải lớn hơn 0!');
            return;
        }
        
        if ($scope.isCreatingOrder) {
            return; // Đang xử lý, không cho click lại
        }
        
        $scope.isCreatingOrder = true;
        
        // Chuẩn bị dữ liệu đơn hàng
        var orderData = {
            shippingAddressId: $scope.selectedAddressId,
            items: [
                {
                    productId: $scope.productDetails.id,
                    quantity: parseInt($scope.buyNowQuantity),
                    attributes: $scope.productDetails.attributes || {}
                }
            ],
            paymentMethod: $scope.selectedPaymentMethod,
            note: $scope.orderNote || ''
        };
        
        // Gọi API tạo đơn hàng
        OrderService.createOrder(orderData)
            .then(function(order) {
                $scope.isCreatingOrder = false;
                
                // Đóng modal
                var modalElement = document.getElementById('buyNowModal');
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
                
                // Hiển thị modal success
                $scope.createdOrder = order;
                var successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
                successModal.show();
                
                // Cập nhật số lượng giỏ hàng
                $scope.loadCartCount();
            })
            .catch(function(error) {
                $scope.isCreatingOrder = false;
                console.error('❌ Lỗi tạo đơn hàng:', error);
                alert('Không thể tạo đơn hàng. Vui lòng thử lại.\n' + (error.message || ''));
            });
    };
    
    // Format tiền tệ
    $scope.formatCurrency = function(amount) {
        if (!amount) return '0₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    
    // Tính tổng tiền tạm tính
    $scope.calculateSubtotal = function() {
        if (!$scope.productDetails || !$scope.productDetails.Price) return 0;
        return $scope.productDetails.Price * $scope.buyNowQuantity;
    };
    
    // Tính tổng tiền cuối cùng
    $scope.calculateTotal = function() {
        return $scope.calculateSubtotal() + $scope.shippingFee;
    };
    
    // Watch số lượng thay đổi để tính lại phí ship
    $scope.$watch('buyNowQuantity', function(newVal, oldVal) {
        if (newVal !== oldVal && $scope.selectedAddressId) {
            $scope.calculateShipping($scope.selectedAddressId);
        }
    });
    
    // View order detail
    $scope.viewOrderDetail = function(orderId) {
        window.location.href = 'checkout.html?orderId=' + orderId;
    };
    
    // ========== KHỞI ĐỘNG ==========
    loadProductDetail();
    // loadRelatedProducts và loadMostViewedProducts sẽ được gọi sau khi loadProductDetail hoàn tất
    
});