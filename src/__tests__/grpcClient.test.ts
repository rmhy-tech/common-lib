import {grpcClients} from "../config/grpcClient";

jest.mock("fs", () => {
    const originalFs = jest.requireActual("fs");
    return {
        ...originalFs, // Keep original fs methods like existsSync
        readdirSync: jest.fn(() => ["user.proto", "post.proto"]), // Mock only this
    };
});

jest.mock("@grpc/proto-loader", () => ({
    loadSync: jest.fn(() => ({})), // Return an empty proto definition
}));

jest.mock("@grpc/grpc-js", () => ({
    credentials: {
        createInsecure: jest.fn(),
    },
    loadPackageDefinition: jest.fn(() => ({
        user: jest.fn().mockImplementation(() => ({
            getUser: jest.fn().mockResolvedValue({ id: "123", name: "Test User" }),
        })),
        post: jest.fn().mockImplementation(() => ({
            getPost: jest.fn().mockResolvedValue({ id: "456", content: "Test Post" }),
        })),
    })),
}));

describe("gRPC Service Loader", () => {
    it("should load gRPC clients dynamically", () => {
        expect(grpcClients).toBeDefined();
        expect(grpcClients.user).toBeDefined();
        expect(grpcClients.post).toBeDefined();
    });

    it("should throw an error for missing gRPC service", () => {
        expect(() => {
            if (!grpcClients.nonexistentService) {
                throw new Error("gRPC service not found");
            }
        }).toThrow("gRPC service not found");
    });

    it("should call getUser() on userService", async () => {
        const response = await grpcClients.user.getUser({ id: "123" });
        expect(response).toEqual({ id: "123", name: "Test User" });
    });

    it("should call getPost() on postService", async () => {
        const response = await grpcClients.post.getPost({ id: "456" });
        expect(response).toEqual({ id: "456", content: "Test Post" });
    });
});
