import Product from "@/components/Product";

const ProductDetail = async ({
    params,
  }: {
    params: Promise<{ id: string }>
  }) => {
   const slug = (await params).id
   return (
    <Product slug={slug} />
   )
  
};

export default ProductDetail;