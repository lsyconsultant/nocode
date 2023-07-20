package com.nocode.framework.bo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BoAttritute {

    private String boId;
    private String id;
    private String name;
    private Boolean key;
    private String type;
    private int length;
    private int point;
    private String desc;

    private String createDatetime;
    private String createBy;
    private String modifyDatetime;
    private String modifyBy;
}
