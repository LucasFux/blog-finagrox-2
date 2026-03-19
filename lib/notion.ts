import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"

if (!process.env.NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN no está definido en .env.local")
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const n2m = new NotionToMarkdown({ notionClient: notion })