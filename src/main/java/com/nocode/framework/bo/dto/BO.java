package com.nocode.framework.bo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;

@Getter
@Setter
@ToString
public class BO {

    public BO(String id) {
        this.id = id;
    }

    public BO() {

    }

    private String id;
    private String name;
    private String desc;
    private String parent;
    private ArrayList<BoAttritute> attributes;
    private ArrayList<BO> childrenBO;

    private String createDatetime;
    private String createBy;
    private String modifyDatetime;
    private String modifyBy;

}
