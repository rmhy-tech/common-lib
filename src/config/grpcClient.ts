import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";
import { logger } from "../utils/logger";

const PROTO_DIR = path.join(__dirname, "../../proto");

const loadGrpcService = (protoFile: string, serviceName: string, url: string) => {
    const protoPath = path.join(PROTO_DIR, protoFile);
    const packageDefinition = protoLoader.loadSync(protoPath);
    const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;

    if (!grpcObject[serviceName]) {
        throw new Error(`gRPC service ${serviceName} not found in ${protoFile}`);
    }

    const client = new grpcObject[serviceName](url, grpc.credentials.createInsecure());
    logger.info(`Loaded gRPC service: ${serviceName} at ${url}`);
    return client;
};

// export const grpcClients = {
//     userService: loadGrpcService("user.proto", "UserService", process.env.GRPC_USER_SERVICE_URL || "http://localhost:50051"),
//     postService: loadGrpcService("post.proto", "PostService", process.env.GRPC_POST_SERVICE_URL || "http://localhost:50052"),
// };
interface GrpcClientMap {
    [key: string]: any; // Define specific service client types later
}

const grpcClients: GrpcClientMap = {};
fs.readdirSync(PROTO_DIR).forEach((file:any) => {
    if (file.endsWith(".proto")) {
        const serviceName = file.replace(".proto", "");
        grpcClients[serviceName] = loadGrpcService(file, serviceName, process.env[`GRPC_${serviceName.toUpperCase()}_URL`] || "http://localhost:50051");
    }
});

export { grpcClients };