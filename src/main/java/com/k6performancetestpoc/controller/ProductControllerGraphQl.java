package com.k6performancetestpoc.controller;

import com.k6performancetestpoc.dto.ProductRequest;
import com.k6performancetestpoc.service.ProductService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Collection;

@Controller
public class ProductControllerGraphQl {
    private final ProductService productService;

    public ProductControllerGraphQl(
            ProductService productService
    ) {
        this.productService = productService;
    }


    @QueryMapping
    Collection<ProductRequest> products() {
        return productService.getAllProducts();
    }
}
