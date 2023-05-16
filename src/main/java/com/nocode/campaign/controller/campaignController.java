package com.nocode.campaign.controller;


import com.nocode.campaign.dto.CampaignDTO;
import com.nocode.campaign.service.CampaignService;
import com.nocode.framework.dto.ResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/campaign")
public class campaignController {

    @Autowired
    CampaignService campaignService;

    @PostMapping("/campaignCreate.do")
    public @ResponseBody ResponseDTO campaignCreate(@RequestBody CampaignDTO dto) {
        log.info(dto.toString());
        ResponseDTO result = campaignService.campaignCreate(dto);
        return result;
    }

    @GetMapping("/getCampaignDetail.do")
    public @ResponseBody CampaignDTO getCampaignDetail(HttpServletRequest req) {
        String campaignId = req.getParameter("campaignId");
        log.info(campaignId);

        CampaignDTO dto = new CampaignDTO();
        dto.setCampaignId(campaignId);

        CampaignDTO result = campaignService.getCampaignDetail(dto);
        return result;
    }
    @GetMapping("/getCampaignList.do")
    public @ResponseBody ArrayList<CampaignDTO> getCampaignList(HttpServletRequest req) {

        CampaignDTO dto = new CampaignDTO();//조회 조건 DTO
        ArrayList<CampaignDTO> result = campaignService.getCampaignList(dto);
        return result;
    }


}
