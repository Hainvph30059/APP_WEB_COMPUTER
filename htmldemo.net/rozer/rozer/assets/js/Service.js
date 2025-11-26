// Thêm Products service vào module HoangDuongApp
angular.module('HoangDuongApp')
    .factory('Products', function ($http) {
        const apiBaseUrl = "http://localhost:8080/api/product";

        return {
            ClickProduct: function (idProduct) {
                const clickProductApi = `${apiBaseUrl}/increase?productID=${idProduct}`;

                // Trả về promise để controller sử dụng
                return $http.post(clickProductApi).then(
                    function (response) {
                        return response.data; // Trả về dữ liệu từ API
                    },
                    function (error) {
                        console.error("Lỗi khi gọi API: ", error);
                        throw error; // Ném lỗi để xử lý bên ngoài
                    }
                );
            }
        };
    });
