package com.nocode.framework.bo.service;

import com.nocode.framework.base.dto.ResponseDTO;
import com.nocode.framework.bo.dao.BoDAO;
import com.nocode.framework.bo.dto.BO;
import com.nocode.framework.bo.dto.BoAttritute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Slf4j
public class BoService {

    @Autowired
    BoDAO boDAO;

    public ResponseDTO BoCreate(BO bo) {
        log.info(bo.toString());

        boDAO.startStransaction();

        ResponseDTO result = new ResponseDTO();
        result = boDAO.boInsert(bo);
        result = boDAO.boAttributeInsert(bo.getAttributes());

        if (result.getResultCd().equals("S")) {
            boDAO.commitTransaction();
        } else {
            boDAO.rollbackTransaction();
        }

        return result;
    }


    public ArrayList<BO> getBoList() {
        return boDAO.queryForList("boList", null);
    }

    public BO getBoDetail(String boId) {
        BO result = new BO();


        //1, BO 기본 정보 조회 후 set\
        BO param = new BO(boId);
        result = (BO) boDAO.queryForOne("bo.boBaseInfoSelect", param);

        //2. BO 속성 정보 조회 후 set
        BoAttritute param2 = new BoAttritute();
        param2.setBoId(boId);
        result.setAttributes(
                boDAO.queryForList("bo.boAttributeInfoSelect", param2)
        );

        //3. BO 자식 정보 조회 후 set


        return result;
    }
}
