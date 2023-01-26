package com.supreme.shoekream.service;

import com.supreme.shoekream.model.dto.AddressDTO;
import com.supreme.shoekream.model.dto.MemberDTO;
import com.supreme.shoekream.model.entity.Address;
import com.supreme.shoekream.model.entity.Member;
import com.supreme.shoekream.model.network.Header;
import com.supreme.shoekream.model.network.security.KreamPrincipal;
import com.supreme.shoekream.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class AddressApiLogicService {
    private final AddressRepository addressRepository;

    @Transactional
    public List<Address> list(Long memberIdx, boolean isBasic){
        List<Address> addressList = addressRepository.findByMemberIdxAndAddressBasic(memberIdx, isBasic);
        return addressList;

    }

    @Transactional
    public Header<AddressDTO> create(AddressDTO request){
        Member member = request.memberDTO().toEntity();
        Address newAddress = addressRepository.save(request.toEntity(member));
        AddressDTO addressDTO = AddressDTO.fromEntity(newAddress);
        return Header.OK(addressDTO);
    }

    @Transactional
    public Header<Address> update(Header<Address> request) {
        Address addressRequest = request.getData();
        Optional<Address> address = addressRepository.findByIdx(11L);
        // 세션처리
        return address.map(
                        addr -> {
                            addr.setName(addressRequest.getName());
                            addr.setHp(addressRequest.getHp());
                            addr.setZipcode(addressRequest.getZipcode());
                            addr.setAddress1(addressRequest.getAddress1());
                            addr.setAddress2(addressRequest.getAddress2());
                            addr.setAddressBasic(addressRequest.isAddressBasic());
                            return addr;
                        }).map(addr -> addressRepository.save(addr))
                .map(Header::OK)
                .orElseGet(() -> Header.ERROR("데이터 없음")
                );
    }
    @Transactional
    public Header delete(Long idx) {
        Optional<Address> address = addressRepository.findByIdx(idx);
        return address.map(addr -> {
            addressRepository.delete(addr);
            return Header.OK();
        }).orElseGet(() -> Header.ERROR("데이터 없음"));
    }
}