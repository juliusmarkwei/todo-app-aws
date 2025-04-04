import { NextRequest, NextResponse } from "next/server";
import {
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "@/app/utils/dynamodb";

const { DYNAMODB_TABLE_NAME } = process.env;

export const GET = async (req: NextRequest) => {
    try {
        const { Items } = await dynamodb.send(
            new ScanCommand({ TableName: DYNAMODB_TABLE_NAME })
        );
        return NextResponse.json({ todos: Items }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error fetching todos" },
            { status: 500 }
        );
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const { title } = await req.json();
        const todo = {
            id: Date.now().toString(),
            title,
            completed: false,
        };

        await dynamodb.send(
            new PutCommand({
                TableName: DYNAMODB_TABLE_NAME,
                Item: todo,
            })
        );
        return NextResponse.json(
            { message: "Created successfully" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create todo" },
            { status: 404 }
        );
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const { id, title, completed } = await req.json();
        await dynamodb.send(
            new UpdateCommand({
                TableName: DYNAMODB_TABLE_NAME,
                Key: { id },
                UpdateExpression: "set title = :t, completed = :c",
                ExpressionAttributeValues: {
                    ":t": title,
                    ":c": completed,
                },
            })
        );
        return NextResponse.json(
            { message: "Updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create todo" },
            { status: 404 }
        );
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const { id } = await req.json();
        await dynamodb.send(
            new DeleteCommand({
                TableName: DYNAMODB_TABLE_NAME,
                Key: { id },
            })
        );
        return NextResponse.json(
            { message: "Deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete todo" },
            { status: 404 }
        );
    }
};
