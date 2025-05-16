export interface IVariant {
    ram: string;
    price: number;
    qty: number;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    subCategory: string;
    variants: IVariant[];
    images: string[];
}
