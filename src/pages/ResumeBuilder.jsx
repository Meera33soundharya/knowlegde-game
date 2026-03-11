import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { FileText, Hammer } from "lucide-react";

export default function ResumeBuilder() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-20 text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                        <FileText className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold">AI Resume Builder</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We are currently building the ultimate AI-powered resume creation tool.
                    Check back soon to create professional resumes in minutes!
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                    <Button disabled>
                        <Hammer className="mr-2 h-4 w-4" />
                        Under Construction
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
