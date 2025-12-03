(function() {
    'use strict';

    angular.module('HoangDuongApp').controller('myAccount', function($scope, $timeout, ShippingAddressService) {

        // ==================== INIT ====================
        $scope.addresses = [];
        $scope.provinces = [];
        $scope.districts = [];
        $scope.wards = [];
        
        $scope.loading = {
            addresses: false,
            provinces: false,
            districts: false,
            wards: false,
            saving: false
        };

        $scope.addressForm = {
            id: null,
            fullName: '',
            phoneNumber: '',
            email: '',
            provinceId: null,
            provinceName: '',
            districtId: null,
            districtName: '',
            wardCode: '',
            wardName: '',
            detailAddress: '',
            isDefault: false
        };

        $scope.isEditMode = false;
        $scope.showForm = false;

        // ==================== LOAD DATA ====================
        
        // Load danh sách địa chỉ
        $scope.loadAddresses = function() {
            $scope.loading.addresses = true;
            ShippingAddressService.getAddresses()
                .then(function(addresses) {
                    $scope.addresses = addresses || [];
                })
                .catch(function(error) {
                    console.error('Error loading addresses:', error);
                    $scope.showNotification('Không thể tải danh sách địa chỉ', 'error');
                })
                .finally(function() {
                    $scope.loading.addresses = false;
                });
        };

        // Load danh sách tỉnh/thành phố
        $scope.loadProvinces = function() {
            $scope.loading.provinces = true;
            ShippingAddressService.getProvinces()
                .then(function(provinces) {
                    $scope.provinces = provinces || [];
                })
                .catch(function(error) {
                    console.error('Error loading provinces:', error);
                    $scope.showNotification('Không thể tải danh sách tỉnh/thành phố', 'error');
                })
                .finally(function() {
                    $scope.loading.provinces = false;
                });
        };

        // Load danh sách quận/huyện
        $scope.onProvinceChange = function() {
            $scope.addressForm.districtId = null;
            $scope.addressForm.districtName = '';
            $scope.addressForm.wardCode = '';
            $scope.addressForm.wardName = '';
            $scope.districts = [];
            $scope.wards = [];

            if (!$scope.addressForm.provinceId) {
                return;
            }

            // Parse về số nguyên nếu cần
            var provinceId = parseInt($scope.addressForm.provinceId);

            // Lấy tên tỉnh
            var selectedProvince = $scope.provinces.find(function(p) {
                return p.ProvinceID == provinceId;
            });
            if (selectedProvince) {
                $scope.addressForm.provinceName = selectedProvince.ProvinceName;
            }

            $scope.loading.districts = true;
            ShippingAddressService.getDistricts(provinceId)
                .then(function(districts) {
                    $scope.districts = districts || [];
                })
                .catch(function(error) {
                    console.error('Error loading districts:', error);
                    $scope.showNotification('Không thể tải danh sách quận/huyện', 'error');
                })
                .finally(function() {
                    $scope.loading.districts = false;
                });
        };

        // Load danh sách phường/xã
        $scope.onDistrictChange = function() {
            $scope.addressForm.wardCode = '';
            $scope.addressForm.wardName = '';
            $scope.wards = [];

            if (!$scope.addressForm.districtId) {
                return;
            }

            // Parse về số nguyên nếu cần
            var districtId = parseInt($scope.addressForm.districtId);

            // Lấy tên quận
            var selectedDistrict = $scope.districts.find(function(d) {
                return d.DistrictID == districtId;
            });
            if (selectedDistrict) {
                $scope.addressForm.districtName = selectedDistrict.DistrictName;
            }

            $scope.loading.wards = true;
            ShippingAddressService.getWards(districtId)
                .then(function(wards) {
                    $scope.wards = wards || [];
                })
                .catch(function(error) {
                    console.error('Error loading wards:', error);
                    $scope.showNotification('Không thể tải danh sách phường/xã', 'error');
                })
                .finally(function() {
                    $scope.loading.wards = false;
                });
        };

        // Lấy tên phường khi chọn
        $scope.onWardChange = function() {
            var selectedWard = $scope.wards.find(function(w) {
                return w.WardCode == $scope.addressForm.wardCode;
            });
            if (selectedWard) {
                $scope.addressForm.wardName = selectedWard.WardName;
            }
        };

        // ==================== FORM ACTIONS ====================
        
        // Mở form thêm mới
        $scope.openAddForm = function() {
            $scope.isEditMode = false;
            $scope.showForm = true;
            $scope.resetForm();
            $scope.loadProvinces();
        };

        // Mở form chỉnh sửa
        $scope.openEditForm = function(address) {
            $scope.isEditMode = true;
            $scope.showForm = true;
            
            // Load provinces trước
            $scope.loadProvinces();
            
            // Sử dụng $timeout để đảm bảo form đã render và binding hoạt động
            $timeout(function() {
                // Copy dữ liệu sang form - map đúng field name từ API
                $scope.addressForm = {
                    id: address.id,
                    fullName: address.recipientName || '', // API trả về recipientName
                    phoneNumber: address.phoneNumber || '',
                    email: address.email || '',
                    provinceId: address.provinceId || null,
                    provinceName: address.provinceName || '',
                    districtId: address.districtId || null,
                    districtName: address.districtName || '',
                    wardCode: address.wardCode || '',
                    wardName: address.wardName || '',
                    detailAddress: address.addressDetail || '', // API trả về addressDetail
                    isDefault: address.isDefault || false
                };

                // Load districts for selected province
                if (address.provinceId) {
                    ShippingAddressService.getDistricts(address.provinceId)
                        .then(function(districts) {
                            $scope.districts = districts || [];
                            
                            // Load wards for selected district
                            if (address.districtId) {
                                ShippingAddressService.getWards(address.districtId)
                                    .then(function(wards) {
                                        $scope.wards = wards || [];
                                    });
                            }
                        });
                }
            }, 100);
        };

        // Đóng form
        $scope.closeForm = function() {
            $scope.showForm = false;
            $scope.resetForm();
        };

        // Reset form
        $scope.resetForm = function() {
            $scope.addressForm = {
                id: null,
                fullName: '',
                phoneNumber: '',
                email: '',
                provinceId: null,
                provinceName: '',
                districtId: null,
                districtName: '',
                wardCode: '',
                wardName: '',
                detailAddress: '',
                isDefault: false
            };
            $scope.districts = [];
            $scope.wards = [];
        };

        // Validate form
        $scope.validateForm = function() {
            if (!$scope.addressForm.fullName || $scope.addressForm.fullName.trim() === '') {
                $scope.showNotification('Vui lòng nhập họ tên', 'error');
                return false;
            }

            if (!$scope.addressForm.phoneNumber || $scope.addressForm.phoneNumber.trim() === '') {
                $scope.showNotification('Vui lòng nhập số điện thoại', 'error');
                return false;
            }

            // Validate phone number format (10-11 digits)
            var phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test($scope.addressForm.phoneNumber)) {
                $scope.showNotification('Số điện thoại không hợp lệ (10-11 chữ số)', 'error');
                return false;
            }

            if (!$scope.addressForm.email || $scope.addressForm.email.trim() === '') {
                $scope.showNotification('Vui lòng nhập email', 'error');
                return false;
            }

            // Validate email format
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test($scope.addressForm.email)) {
                $scope.showNotification('Email không hợp lệ', 'error');
                return false;
            }

            if (!$scope.addressForm.provinceId) {
                $scope.showNotification('Vui lòng chọn tỉnh/thành phố', 'error');
                return false;
            }

            if (!$scope.addressForm.districtId) {
                $scope.showNotification('Vui lòng chọn quận/huyện', 'error');
                return false;
            }

            if (!$scope.addressForm.wardCode) {
                $scope.showNotification('Vui lòng chọn phường/xã', 'error');
                return false;
            }

            if (!$scope.addressForm.detailAddress || $scope.addressForm.detailAddress.trim() === '') {
                $scope.showNotification('Vui lòng nhập địa chỉ chi tiết', 'error');
                return false;
            }

            return true;
        };

        // Lưu địa chỉ (thêm mới hoặc cập nhật)
        $scope.saveAddress = function() {
            if (!$scope.validateForm()) {
                return;
            }

            $scope.loading.saving = true;

            var addressData = {
                recipientName: $scope.addressForm.fullName.trim(), // Gửi lên API là recipientName
                phoneNumber: $scope.addressForm.phoneNumber.trim(),
                email: $scope.addressForm.email.trim(),
                provinceId: $scope.addressForm.provinceId,
                provinceName: $scope.addressForm.provinceName,
                districtId: $scope.addressForm.districtId,
                districtName: $scope.addressForm.districtName,
                wardCode: $scope.addressForm.wardCode,
                wardName: $scope.addressForm.wardName,
                addressDetail: $scope.addressForm.detailAddress.trim() // Gửi lên API là addressDetail
            };

            var promise;
            if ($scope.isEditMode) {
                // Cập nhật
                promise = ShippingAddressService.updateAddress($scope.addressForm.id, addressData);
            } else {
                // Thêm mới
                promise = ShippingAddressService.createAddress(addressData);
            }

            promise
                .then(function(result) {
                    $scope.showNotification(
                        $scope.isEditMode ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công',
                        'success'
                    );
                    $scope.closeForm();
                    $scope.loadAddresses();
                })
                .catch(function(error) {
                    console.error('Error saving address:', error);
                    $scope.showNotification(
                        error.message || 'Có lỗi xảy ra khi lưu địa chỉ',
                        'error'
                    );
                })
                .finally(function() {
                    $scope.loading.saving = false;
                });
        };

        // ==================== ADDRESS ACTIONS ====================
        
        // Xóa địa chỉ
        $scope.deleteAddress = function(address) {
            if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ "' + address.recipientName + '"?')) {
                return;
            }

            ShippingAddressService.deleteAddress(address.id)
                .then(function() {
                    $scope.showNotification('Xóa địa chỉ thành công', 'success');
                    $scope.loadAddresses();
                })
                .catch(function(error) {
                    console.error('Error deleting address:', error);
                    $scope.showNotification(
                        error.message || 'Không thể xóa địa chỉ',
                        'error'
                    );
                });
        };

        // Đặt làm địa chỉ mặc định
        $scope.setDefault = function(address) {
            if (address.isDefault) {
                return; // Đã là mặc định rồi
            }

            ShippingAddressService.setDefaultAddress(address.id)
                .then(function() {
                    $scope.showNotification('Đã đặt làm địa chỉ mặc định', 'success');
                    $scope.loadAddresses();
                })
                .catch(function(error) {
                    console.error('Error setting default address:', error);
                    $scope.showNotification(
                        error.message || 'Không thể đặt địa chỉ mặc định',
                        'error'
                    );
                });
        };

        // ==================== NOTIFICATION ====================
        
        $scope.showNotification = function(message, type) {
            // Simple alert for now - có thể thay bằng toast library
            if (type === 'success') {
                alert('✓ ' + message);
            } else {
                alert('✗ ' + message);
            }
        };

        // ==================== HELPERS ====================
        
        // Format full address
        $scope.getFullAddress = function(address) {
            var parts = [];
            if (address.addressDetail) parts.push(address.addressDetail); // API trả về addressDetail
            if (address.wardName) parts.push(address.wardName);
            if (address.districtName) parts.push(address.districtName);
            if (address.provinceName) parts.push(address.provinceName);
            return parts.join(', ');
        };

        // ==================== INIT LOAD ====================
        
        $scope.loadAddresses();
    });

})();
