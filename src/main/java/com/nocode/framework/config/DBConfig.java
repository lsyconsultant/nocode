package com.nocode.framework.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.sql.SQLException;

@Component
@Configuration
@EnableTransactionManagement
@Slf4j
public class DBConfig {

    @Bean(name = "dataSource")
    public DataSource dataSource() throws SQLException {

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName(Common.getInstance().getProp("spring.datasource.driver-class-name"));
        hikariConfig.setJdbcUrl(Common.getInstance().getProp("spring.datasource.url"));
        hikariConfig.setUsername(Common.getInstance().getProp("spring.datasource.username"));
        hikariConfig.setPassword(Common.getInstance().getProp("spring.datasource.password"));
        hikariConfig.setAutoCommit(true);
        hikariConfig.setMinimumIdle(5);
        hikariConfig.setMaximumPoolSize(5);
        hikariConfig.setConnectionTimeout(300000);

        HikariDataSource dataSource = new HikariDataSource(hikariConfig);
        if (dataSource.getConnection().isValid(10)) {
            log.info("================DB Connection 성공================");
        } else {
            log.info("================DB Connection  실패================");
        }
//
        return dataSource;

    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(@Qualifier("dataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);


        String sqlMapConfigPath = "classpath:/conf/mybatis/mybatis-config.xml";
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resources = resolver.getResource(sqlMapConfigPath);

        sqlSessionFactoryBean.setConfigLocation(resources);
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources("classpath:/conf/mybatis/sqlMap/**/*.xml"));
        sqlSessionFactoryBean.afterPropertiesSet();

        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) throws Exception {
        SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sqlSessionFactory);
        return sqlSessionTemplate;
    }

    @Bean
    public DataSourceTransactionManager transactionManager(@Qualifier("dataSource") DataSource dataSource) throws SQLException {
        DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager(dataSource);
        return dataSourceTransactionManager;
    }

}
