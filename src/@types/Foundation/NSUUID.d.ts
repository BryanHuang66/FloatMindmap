export{}
declare global{
    class NSUUID{
        static UUID():NSUUID
        static alloc():NSUUID
        static new():NSUUID
        readonly UUIDString: string;
        static readonly supportsSecureCoding: boolean; // inherited from NSSecureCoding
    }
}