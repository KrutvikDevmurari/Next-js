import connectDB from "@/lib/dbConnection"
import Page from "./login/page";

export default async function Home() {
  await connectDB().then(res => {
    console.log("Databse connected Sucessfully");
  }).catch(err => {
    console.log(err)
  })
  return (
    <> <Page /></>
  )
}
