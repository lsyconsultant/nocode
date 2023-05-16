package com.nocode.campaign.dao;

import com.nocode.campaign.dto.CampaignDTO;
import com.nocode.framework.dao.BaseDAO;
import com.nocode.framework.dto.ResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Repository
public class CampaignDAO extends BaseDAO {

    public ResponseDTO campaignCreate(CampaignDTO dto) {
        log.info(dto.toString());

        dto.setCampaignId(generateCamId());
        dto.setStatus("OPEN");
        dto.setCreateDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        dto.setCreateBy("로그인세션 유저");
        dto.setModifyDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        dto.setModifyBy("로그인세션 유저");

        int sqlResult = 0;
        try{
            sqlResult = this.insert("campaign.createCampaign", dto);
        }catch (Exception e){
            e.printStackTrace();
        }

        ResponseDTO result = new ResponseDTO();
        if( sqlResult == 1){
            result.setResultCd("S");
            result.setResultMsg("캠페인 기본정보 생성 완료");

            Map<String,Object> map = new HashMap<>();
            map.put("campaignId", dto.getCampaignId());
            result.setData(map);
        }else{
            result.setResultCd("E");
            result.setResultMsg("캠페인 기본정보 생성 실패");
        }

        log.info(result.toString());
        return result;
    }

    public CampaignDTO getCampaignDetail(CampaignDTO dto){

        CampaignDTO  result = (CampaignDTO) this.queryForOne("campaign.getCampaignDetail", dto);
        return result;

    }

    public ArrayList<CampaignDTO> getCampaignList(CampaignDTO dto){

        ArrayList<CampaignDTO>  result = this.queryForList("campaign.getCampaignList", dto);
        return result;

    }

    public String generateCamId() {
        return "CAM" + UUID.randomUUID().toString().replaceAll("-", "");
    }



}

