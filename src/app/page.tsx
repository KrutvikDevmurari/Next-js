import connectDB from "@/lib/dbConnection"

export default async function Home() {
  await connectDB().then(res => {
    console.log("Databse connected Sucessfully");
  }).catch(err => {
    console.log(err)
  })
  return (
    <> hii</>
  )
}
