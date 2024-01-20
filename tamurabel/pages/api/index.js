export default async function handler(req, res) {
    console.log("Input received");
    res.status(200).json({message: "Request processed successfully"});
}