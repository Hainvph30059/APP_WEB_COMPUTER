var app = angular.module('shopProduct', ['ProductService']);
app.controller('product', function ($scope, $http, Products) {
    $scope.tilte = "Danh sách sản phẩm";
    // Khởi tạo các biến
    $scope.pageNumber = 1; // Trang hiện tại
    $scope.pageSize = 12;  // Kích thước mỗi trang
    $scope.searchKey = ""; // Từ khóa tìm kiếm
    $scope.totalItems = 0;
    $scope.isLoading = false; // Trạng thái loading
    const apiBaseUrl = "http://192.168.1.36:8386/api/product";

    // Hàm lấy dữ liệu sản phẩm
    $scope.getProductData = function () {
        $scope.isLoading = true; // Bắt đầu loading
        const productApi = `${apiBaseUrl}?pageNumber=${$scope.pageNumber}&pageSize=${$scope.pageSize}`;

        $http.get(productApi).then(
            function (response) {
                if (response.status === 200) {
                    $scope.updateProductList(response.data);
                } else {
                    console.error("Lỗi khi lấy dữ liệu, mã trạng thái: ", response.status);
                }
            },
            function (error) {
                console.error("Lỗi khi gọi API: ", error);
                $scope.errorMessage = "Không thể tải dữ liệu từ API.";
            }

        ).finally(function () {
            $scope.isLoading = false; // Kết thúc loading
        });
    };

    // Hàm thực hiện tìm kiếm
    $scope.searchProducts = function (searchKey) {
        $scope.isLoading = true; // Bắt đầu loading
        $scope.searchKey = searchKey;
        if (!searchKey) {
            // Nếu từ khóa tìm kiếm trống, tải lại danh sách đầy đủ
            $scope.getProductData();
            return;
        }

        const searchApi = `${apiBaseUrl}/name?keyword=${encodeURIComponent(searchKey)}&pageNumber=${$scope.pageNumber}&pageSize=${$scope.pageSize}`;

        $http.get(searchApi).then(
            function (response) {
                if (response.status === 200) {
                    $scope.updateProductList(response.data);
                }
                else {
                    console.error("Lỗi khi tìm kiếm, mã trạng thái: ", response.status);
                }
            },
            function (error) {
                console.error("Lỗi khi gọi API tìm kiếm: ", error);
                $scope.errorMessage = "Không có sản phẩm nào như vậy, hãy thử với từ khóa khác";
            }
        ).finally(function () {
            $scope.isLoading = false; // Kết thúc loading
        });
    };

    // Cập nhật danh sách sản phẩm
    $scope.updateProductList = function (data) {
        $scope.listProduct = data.Items || [];
        $scope.totalItems = data.TotalItems || 0;
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.pageSize);

        // Xử lý dữ liệu sản phẩm
        $scope.listProduct.forEach(function (product) {
            product.ImageUrls = product.ImageUrls.map(function (url) {
                return "http://192.168.1.36:8386/" + url.replace(/\\/g, '/');
            });
        });
    };
    // Chuyển đổi trang
    $scope.changePage = function (page) {
        if (page >= 1 && page <= Math.ceil($scope.totalItems / $scope.pageSize)) {
            $scope.pageNumber = page;
            if (!$scope.searchKey) {
                $scope.getProductData();
            } else {
                $scope.searchProducts($scope.searchKey);
            }
        }
    };
    // Gọi dữ liệu ban đầu
    $scope.getProductData();
    $scope.closeError = function () {
        $scope.errorMessage = '';
    }
    // lấy sản phẩm hiện tại
    $scope.openQuickView = function (product) {
        $scope.selectedProduct = product; // Lưu thông tin sản phẩm vào biến
    };
    // xóa sản phẩm hiện tại thông qua nút close hoặc nhấn ra ngoài modal
    $scope.clearSelectedProduct = function () {
        $scope.selectedProduct = null;
    };
    $scope.updateViewCount = function (ProductID) {
        Products.ClickProduct(ProductID);
        return;
    }
})