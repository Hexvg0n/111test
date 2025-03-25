export async function GET(req, { params }) {
    try {
      await connectToDB()
      const product = await Product.findById(params.id) // Upewnij się że używasz właściwej metody
      if (!product) return new NextResponse('Product not found', { status: 404 })
      return NextResponse.json(product)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }