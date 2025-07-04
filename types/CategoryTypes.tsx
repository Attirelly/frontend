export interface SubCat3 {
    category_id:string;
    children?:[];
    name:string,
    parent_id:string;
}
export interface SubCat2 {
    category_id:string;
    children:SubCat3[];
    name:string;
    parent_id:string;
}
export interface SubCat1 {
    category_id:string;
    children:SubCat2[];
    name:string;
    parent_id:string;
}

export interface Category{
    category_id:string;
    children:SubCat1[];
    name:string;
    parent_id?:string | null;
}