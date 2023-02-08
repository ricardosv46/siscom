const NestLayout = (parent:any, child:any) => (page:any) => parent(child(page));

export default NestLayout;