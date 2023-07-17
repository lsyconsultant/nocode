package com.nocode.campaign.service;


import com.nocode.campaign.dao.CampaignDAO;
import com.nocode.campaign.dto.CampaignDTO;
import com.nocode.framework.base.dto.ResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
public class CampaignService {

    @Autowired
    CampaignDAO campaignDAO;

    public ResponseDTO campaignCreate(CampaignDTO dto){
        log.info(dto.toString());

        ResponseDTO result = campaignDAO.campaignCreate(dto);
        return result;
    }

    public CampaignDTO getCampaignDetail(CampaignDTO dto) {
        log.info(dto.toString());

        CampaignDTO result = campaignDAO.getCampaignDetail(dto);

        return result;
    }
    public ArrayList<CampaignDTO> getCampaignList(CampaignDTO dto){
        log.info(dto.toString());

        ArrayList<CampaignDTO> result = campaignDAO.getCampaignList(dto);
        return result;
    }
}
