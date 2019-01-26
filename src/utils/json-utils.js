class JsonUtils {
    toBase64(content) {
        return Buffer.from(JSON.stringify(content, null, "\t")).toString("base64");
    }
}
export default new JsonUtils();