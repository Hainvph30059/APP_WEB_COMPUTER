// Sử dụng module HoangDuongApp đã được định nghĩa trong main.js
angular.module('HoangDuongApp')
.controller('productList', function ($scope, $http, Products, CartService) {
    // Tiêu đề
    $scope.title = "Danh sách sản phẩm";
    $scope.cartCount = 0; // Khởi tạo số lượng giỏ hàng
    
    // Lấy số lượng sản phẩm trong giỏ hàng
    $scope.loadCartCount = function() {
        CartService.getCartCount().then(function(count) {
            $scope.cartCount = count;
        });
    };
    
    // Gọi khi controller khởi tạo
    $scope.loadCartCount();

    // Config
    const apiBase = 'http://localhost:8080/api/product/product-type-name/';
    $scope.pageNumber = 1;
    $scope.pageSize = 10;
    $scope.searchKey = '';
    $scope.isLoading = false;
    $scope.listProduct = [];
    $scope.totalPages = 1;
    $scope.totalElements = 0;

    function getTypeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('type');
    }

    // productType can come from URL ?type=... or from localStorage (set by category links)
    var productType = getTypeFromUrl() || localStorage.getItem('productType') || 'cpu';

    $scope.getProductData = function (page) {
        page = page || $scope.pageNumber || 1;
        $scope.isLoading = true;
        let url = apiBase + encodeURIComponent(productType) + '?page=' + page + '&size=' + $scope.pageSize;
        if ($scope.searchKey) {
            url += '&keyword=' + encodeURIComponent($scope.searchKey);
        }

        $http.get(url)
            .then(function (resp) {
                if (resp && resp.status === 200 && resp.data && resp.data.code === 1000) {
                    const res = resp.data.result || {};
                    $scope.pageNumber = res.currentPage || page;
                    $scope.pageSize = res.pageSize || $scope.pageSize;
                    $scope.totalPages = res.totalPages || 1;
                    $scope.totalElements = res.totalElements || 0;

                    const items = res.data || [];
                    // Normalize item fields used by template
                    $scope.listProduct = items.map(function (p) {
                        p.urls = p.urls || [];
                        p.name = p.name || p.Name || '';
                        p.price = p.price || p.Price || 0;
                        p.id = p.id || p.ID || p.MainProductID || p.ProductID;
                        p.productTypeName = p.productTypeName || p.type || productType;
                        p.description = p.description || p.Description || '';
                        return p;
                    });
                } else {
                    console.error('Unexpected response:', resp);
                    $scope.listProduct = [];
                    $scope.totalPages = 1;
                    $scope.totalElements = 0;
                }
            })
            .catch(function (err) {
                console.error('Error fetching products:', err);
                $scope.listProduct = [];
            })
            .finally(function () {
                $scope.isLoading = false;
            });
    };

    $scope.changePage = function (page) {
        if (!page) return;
        if (page < 1) page = 1;
        if ($scope.totalPages && page > $scope.totalPages) page = $scope.totalPages;
        $scope.pageNumber = page;
        $scope.getProductData(page);
    };

    $scope.searchProducts = function (key) {
        $scope.searchKey = key || '';
        $scope.pageNumber = 1;
        $scope.getProductData(1);
    };

    $scope.updateViewCount = function (productId) {
        if (!productId) return;
        Products.ClickProduct(productId).catch(function () { /* ignore errors */ });
    };

    // Thêm vào giỏ hàng
    $scope.addToCart = function(productId, quantity, productName) {
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

    // initial load
    $scope.getProductData($scope.pageNumber);
});
