// Sử dụng module HoangDuongApp đã được định nghĩa trong main.js
angular.module('HoangDuongApp')
.controller('product', function ($scope, $http, $q, Products, CartService) {
  $scope.title = "Sản phẩm Laptop";
  $scope.productTypes = [];
  $scope.hardwareTabs = [
    { id: 1, name: 'Motherboard', type: 'mainboard', products: [], scopeKey: 'listMotherboard' },
    { id: 2, name: 'Chip', type: 'cpu', products: [], scopeKey: 'listCpu' },
    { id: 3, name: 'Ram', type: 'ram', products: [], scopeKey: 'listRam' },
    { id: 4, name: 'Ổ cứng', type: 'storage', products: [], scopeKey: 'listStorage' },
    { id: 5, name: 'Card đồ họa', type: 'gpu', products: [], scopeKey: 'listGpu' },
    { id: 6, name: 'Nguồn', type: 'powersupply', products: [], scopeKey: 'listPowersupply' }
  ];
  $scope.tabTwo = [
    { id: 7, name: 'Server', type: 'server', products: [], scopeKey: 'listServer' },
    { id: 8, name: 'Thiết bị mạng', type: 'networkdevice', products: [], scopeKey: 'listNetwork' }
  ];

  // Lấy danh sách product types
  $http.get('http://localhost:8080/api/product-type')
    .then(function (response) {
      if (response.data && response.data.result) {
        $scope.productTypes = response.data.result;
      }
    });

  // Danh sách các loại sản phẩm cần lấy dữ liệu
  const productTypesToFetch = [
    { type: 'laptop', scopeKey: 'listLaptop' },
    { type: 'pc', scopeKey: 'listPc' },
    { type: 'mainboard', scopeKey: 'listMotherboard' },
    { type: 'cpu', scopeKey: 'listCpu' },
    { type: 'ram', scopeKey: 'listRam' },
    { type: 'storage', scopeKey: 'listStorage' },
    { type: 'gpu', scopeKey: 'listGpu' },
    { type: 'powersupply', scopeKey: 'listPowersupply' },
    { type: 'server', scopeKey: 'listServer' },
    { type: 'networkdevice', scopeKey: 'listNetwork' },
    { type: 'camera', scopeKey: 'listCamera' }
  ];

  // Hàm tổng quát để lấy dữ liệu sản phẩm
  function fetchProductsByType(type, scopeKey) {
    return $http.get('http://localhost:8080/api/product/product-type-name/' + type + '?page=1&size=10')
      .then(function (response) {
        if (response.data && response.data.result && response.data.result.data) {
          $scope[scopeKey] = response.data.result.data;
          // Cập nhật dữ liệu cho hardwareTabs
          const hardwareTab = $scope.hardwareTabs.find(t => t.scopeKey === scopeKey);
          if (hardwareTab) {
            hardwareTab.products = response.data.result.data;
          }
          // Cập nhật dữ liệu cho tabs nếu trùng scopeKey
          const tab = $scope.tabTwo.find(t => t.scopeKey === scopeKey);
          if (tab) {
            tab.products = response.data.result.data;
          }
        }
      });
  }

  // Gọi API cho tất cả loại sản phẩm
  $q.all(productTypesToFetch.map(item => fetchProductsByType(item.type, item.scopeKey)))
    .then(() => {
      console.log('All products fetched');
      // Swiper cho hardwareTabs
    const hardwareSwiper = new Swiper('.feature-slider-2.hardware-slider', {
      slidesPerView: 4,
      spaceBetween: 2,
      navigation: {
        nextEl: '.hardware-slider .swiper-button-next',
        prevEl: '.hardware-slider .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }
      }
    });
    // Swiper cho tabTwo
    const tabTwoSwiper = new Swiper('.feature-slider-2.network-slider', {
      slidesPerView: 4,
      spaceBetween: 2,
      navigation: {
        nextEl: '.network-slider .swiper-button-next',
        prevEl: '.network-slider .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }
      }
    });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });

  // Hàm setProductType
  $scope.setProductType = function (type) {
    // Logic để xử lý khi nhấn "Xem thêm"
    console.log('Selected product type:', type);
    // Ví dụ: Chuyển hướng hoặc lấy thêm dữ liệu
    // window.location.href = `/products?type=${type}`;
  };

  // Sử dụng CartService trực tiếp từ HoangDuongApp
  $scope.addToCart = function(productId, quantity, productName) {
    CartService.addToCart(productId, quantity || 1)
      .then(function(cart) {
        console.log('✅ Thêm vào giỏ hàng thành công:', cart);
        
        var message = productName 
          ? 'Đã thêm "' + productName + '" vào giỏ hàng!' 
          : 'Đã thêm sản phẩm vào giỏ hàng!';
        
        alert(message);
        
        // Cập nhật badge
        if (window.updateCartBadge) {
          window.updateCartBadge(cart.totalItems);
        }
      })
      .catch(function(error) {
        console.error('❌ Lỗi thêm vào giỏ hàng:', error);
        alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
      });
  };

});
