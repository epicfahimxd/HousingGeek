import Papa from "papaparse";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const csvFilePath = path.join(process.cwd(), "data", "houses.csv");
        const fileContent = fs.readFileSync(csvFilePath, "utf8");

        const parsed = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });
        console.log(parsed.data);
        return Response.json(parsed.data);
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Failed to read CSV file" }),
            { status: 500 }
        );
    }
}