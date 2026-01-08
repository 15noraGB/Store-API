export interface Product {
    id: number;
    created_at: Date;
    title: string;
    price: number;
    description: string;
    category: number;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}


export type CreateProductDTO = Omit<Product, 'id' | 'created_at'>;
export type UpdateProductDTO = Partial<Product>;

