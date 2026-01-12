package com.k6performancetestpoc.controller;

import com.k6performancetestpoc.dto.ProductRequest;
import com.k6performancetestpoc.service.ProductService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Collection;
import java.util.Random;

@Controller
public class ProductControllerGraphQl {
    private final ProductService productService;
    private final Random random = new Random();

    public ProductControllerGraphQl(
            ProductService productService
    ) {
        this.productService = productService;
    }


    @QueryMapping
    Collection<ProductRequest> products() {
        // 1% chance of throwing an error
        if (random.nextInt(100) < 1) {
            System.out.println("Throwing random error");
            throw new IllegalCallerException("Random error occurred while fetching products");
        }
        return productService.getAllProducts();
    }
}
