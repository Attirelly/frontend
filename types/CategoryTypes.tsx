// export interface SubCat3 {
//     category_id:string;
//     name:string;
//     parent_id:string;
// }
// export interface SubCat2 {
//     category_id:string;
//     children:SubCat3[];
//     name:string;
//     parent_id:string;
// }
// export interface SubCat1 {
//     category_id:string;
//     children:SubCat2[];
//     name:string;
//     parent_id:string;
// }

// export interface Category{
//     category_id:string;
//     children:SubCat1[];
//     name:string;
//     parent_id?:string | null;
// }

export interface SubCat3 {
  category_id: string;
  name: string;
}

export interface SubCat2 {
  category_id: string;
  name: string;
  children: SubCat3[];
}

export interface SubCat1 {
  category_id: string;
  name: string;
  children: SubCat2[];
}

export interface Category {
  category_id: string;
  name: string;
  parent_id?: string | null;
  children: SubCat1[];
}

export interface categoryname {
  name : string ;
}