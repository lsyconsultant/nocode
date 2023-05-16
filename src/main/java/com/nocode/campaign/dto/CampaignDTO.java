package com.nocode.campaign.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CampaignDTO {

    String campaignId;
    String campaignNm;
    String status;
    String createDatetime;
    String createBy;
    String modifyDatetime;
    String modifyBy;

}
