# Spec

- elements: element 不要自己生成 unique（副作用不可控）
- component 中 intent 部分的输出如果没有被 model driver 或者其它机制订阅的话不会触发值
