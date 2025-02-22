import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"; // For signature verification

// Hardcoded VPN keys for demo purposes
// In production, these should be stored securely in a database
const AUTHORIZED_USERS: Record<string, string> = {
  // Add your test wallet addresses here
  your_solana_wallet_address: "VPN-KEY-XXXXX-XXXXX-XXXXX",
  // Add more authorized users as needed
};

export async function POST(request: Request) {
  try {
    const { address, signedMessage, originalMessage } = await request.json();

    if (!address || !signedMessage || !originalMessage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert the signed message and original message to Uint8Array
    const signature = Uint8Array.from(Buffer.from(signedMessage, "base64"));
    const message = new TextEncoder().encode(originalMessage);

    // Verify the signature using the public key
    const publicKey = new PublicKey(address);
    const verified = nacl.sign.detached.verify(
      message,
      signature,
      publicKey.toBytes()
    );

    if (!verified) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Check if the address is authorized
    const vpnKey = AUTHORIZED_USERS[address];
    if (!vpnKey) {
      // For demo purposes, generate a VPN key for any valid signature
      // In production, you should only provide keys to authorized users
      const demoVpnKey = `VPN-KEY-${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      return NextResponse.json({
        success: true,
        vpnKey: demoVpnKey,
        message: "Demo VPN key generated",
      });
    }

    return NextResponse.json({
      success: true,
      vpnKey,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
