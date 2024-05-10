import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Table } from 'primeng/table';
// import { Product } from 'src/app/demo/api/product';
// import { ProductService } from 'src/app/demo/service/product.service';
import { Product } from 'src/app/@api/dummy';
import { ProductService } from 'src/app/@service/dummy.service';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {
    
    productForm:FormGroup;
    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    products: Product[] = [];
    product: Product = {};
    selectedProducts: Product[] = [];

    loading:boolean=true;
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    status=[
        {label:"Available",value:"available"},
        {label:"Unavailable",value:"unavailable"},
    ];

    Categories = [
        { "name": "Smartphones", "value": "smartphones" },
        { "name": "Laptops", "value": "laptops" },
        { "name": "Fragrances", "value": "fragrances" },
        { "name": "Skincare", "value": "skincare" },
        { "name": "Groceries", "value": "groceries" },
        { "name": "Home Decoration", "value": "home-decoration" }
    ]

    Brands=[ "Apple", "Samsung", "OPPO", "Huawei", "Microsoft Surface",
     "Infinix", "HP Pavilion", "Impression of Acqua Di Gio", "Royal_Mirage"
    ];

    filteredBrands: any[] | undefined;

    constructor(private productService: ProductService,
         private messageService: MessageService,
         private fb: FormBuilder,
         ) { }

    ngOnInit() {
        // this.productService.getProducts().then(data => this.products = data);
        this.getAllProducts();
        this.setProductForm();

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    getAllProducts(){
    this.productService.getAllProducts().subscribe(res => {
        this.products = res.products;
        console.log('All Products',this.products);
        this.loading=false;
        },
        error =>{
            console.error('Get all Product Error',error);
            this.loading=false;
        });
    }

    setProductForm(){
        this.productForm = this.fb.group({
            title: new FormControl('', Validators.required),
            brand: new FormControl('', Validators.required),
            price: new FormControl('', [Validators.required,Validators.min(1)]),
            discountPercentage: new FormControl('', [Validators.max(100),Validators.min(0)]),
            rating: new FormControl('', Validators.required),
            stock: new FormControl('', [Validators.required,Validators.min(0)]),
            category: new FormControl('', [Validators.required]),
            description: new FormControl('', Validators.required),
            images: this.fb.array([this.imagesFiled()], Validators.required),
            thumbnail:new FormControl('')
        })
    }

    get f() { return this.productForm.controls; }


    filterBrands(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.Brands as any[]).length; i++) {
            let brand = (this.Brands as any[])[i];
            if (brand.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(brand);
            }
        }
        this.filteredBrands = filtered;
        console.log('filtered',filtered);
    }

    imagesFiled(){
        const imageUrlPattern = 'https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\/?#]+)+\.(?:jpg|jpeg|png|gif|bmp|svg)';
        return this.fb.group({
          image_url: new FormControl('', [Validators.required,Validators.pattern(imageUrlPattern)])
        })
    }

    getImagesForm(){
        return this.productForm.get('images') as FormArray
    }

    addImagesForm(){
        this.getImagesForm().push(this.imagesFiled())
    }
    removeImages(i:number){
        this.getImagesForm().removeAt(i)
    }

    openNew() {
        this.productForm.reset();
        // this.submitted = false;
        this.productDialog = true;
    }

    productFormSubmit(){
        console.log("form data",this.productForm.value);
        if(this.productForm.valid){
            this.productService.createProduct(this.productForm.value).subscribe(res => {
                console.log('response',res);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Created', life: 3000 });
            },error =>{
                    console.error('create Product Error',error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating product', life: 3000 });
            });
        }
    }
    

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        // if (this.product.name?.trim()) {
        //     if (this.product.id) {
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
        //         this.products[this.findIndexById(this.product.id)] = this.product;
        //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        //     } else {
        //         this.product.id = this.createId();
        //         this.product.code = this.createId();
        //         this.product.image = 'product-placeholder.svg';
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
        //         this.products.push(this.product);
        //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        //     }

        //     this.products = [...this.products];
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
