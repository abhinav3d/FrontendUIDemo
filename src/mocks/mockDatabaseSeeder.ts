import { db } from "@/src/lib/backend/db/db.server";
import { USER_ROLE } from "@/src/domains/app/app.types";
import { AssetDomain, AssetCategory } from "@/src/domains/asset/asset.types";
import { CreationType, ArtifactType } from "@/src/domains/creation/creation.types";
import { ExecutionMode } from "@/src/domains/template/template.types";
import { 
  BusinessCaseAction, 
  BusinessCaseStatus, 
  CommercialQuoteStatus, 
  ReferenceOrderType 
} from "@/src/domains/business_case/businessCase.types";
import { WorkOrderStatus, WorkOrderType, DeliveryType } from "@/src/domains/workorder/work_order.types";
import { AICoinDirection, AICoinReferenceType } from "@/src/domains/wallet/ai_coin.types";
import { NotificationPriority, NotificationType } from "@/src/domains/notification/notification.types";
import { ConversationReferenceType, ConversationRole } from "@/src/domains/conversation/conversation.types";

/**
 * 🚀 12-Domain Master Mock Seeder
 * Injects relational data across the entire ecosystem for local development.
 */
export async function seedMockDatabase() {
  console.log("🌱 Starting 12-Domain Master Seed Sequence...");

  const MOCK_USER_ID = "gid://shopify/Customer/99999999";
  const INTERNAL_USER_ID = "user_god_mode_999";
  const TEMPLATE_ID = "tpl_cyberpunk_001";
  const VARIANT_ID = "gid://shopify/ProductVariant/333444";
  const BUSINESS_CASE_ID = "bc_active_001";
  const CREATION_ID = "creation_active_001";
  const WORK_ORDER_ID = "wo_active_001";
  const ASSET_IMAGE_ID = "asset_user_upload_001";
  const ASSET_MESH_ID = "asset_final_helmet_001";

  // 1. identity & account
  console.log("👤 Seeding Identity & Account...");
  await db.user.create({
    data: {
      userId: INTERNAL_USER_ID,
      shopifyCustomerId: MOCK_USER_ID,
      email: "abhinav@my3dmeta.com",
      firstName: "Abhinav",
      lastName: "GodMode",
      role: USER_ROLE.ADMIN,
      avatarUrl: "https://picsum.photos/seed/godmode/200/200",
    }
  });

  // 2. wallet
  console.log("💰 Seeding Wallet...");
  await db.wallet.create({
    data: {
      userId: INTERNAL_USER_ID,
      balance: 500,
    }
  });

  // 3. template
  console.log("🎨 Seeding Template...");
  await db.template.create({
    data: {
      id: TEMPLATE_ID,
      name: "Cyberpunk Helmet",
      slug: "cyberpunk-helmet",
      description: "A high-detail futuristic helmet template.",
      groupId: "tg_helmets",
      isActive: true,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });

  // 4. asset
  console.log("📦 Seeding Assets...");
  // User Uploaded Image
  await db.asset.create({
    data: {
      id: ASSET_IMAGE_ID,
      domain: AssetDomain.CREATION,
      domainReferenceId: CREATION_ID,
      originalName: "user_reference.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 1024 * 500,
      category: AssetCategory.IMAGE,
      url: "https://picsum.photos/seed/reference/800/800",
      isPrivate: true,
      isEncrypted: false,
      createdAt: Date.now()
    }
  });
  // Finalized Mesh
  await db.asset.create({
    data: {
      id: ASSET_MESH_ID,
      domain: AssetDomain.WORKORDER,
      domainReferenceId: WORK_ORDER_ID,
      originalName: "damaged_helmet.glb",
      mimeType: "model/gltf-binary",
      sizeBytes: 1024 * 1024 * 3,
      category: AssetCategory.MESH,
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/402002f196828a9539efd28748cd7c9d96c93cd2/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
      isPrivate: false,
      isEncrypted: false,
      createdAt: Date.now()
    }
  });

  // 5. creation
  console.log("✨ Seeding Creation...");
  await db.creation.create({
    data: {
      id: CREATION_ID,
      userId: INTERNAL_USER_ID,
      name: "Cyberpunk Project X",
      type: CreationType.IMAGE_TO_3D_FULL_SYNTHESIS,
      templateId: TEMPLATE_ID,
      inputs: [
        {
          id: ASSET_IMAGE_ID,
          label: "Reference Image",
          type: ArtifactType.IMAGE,
          path: "https://picsum.photos/seed/reference/800/800",
          createdAt: Date.now()
        }
      ],
      outputs: [],
      executionMode: ExecutionMode.AI_PLUS_ARTIST,
      version: 1,
      lastUpdated: Date.now()
    }
  });

  // 6. commerce
  console.log("🛒 Seeding Commerce...");
  await db.commerce.create({
    data: {
      variantId: VARIANT_ID,
      productId: "gid://shopify/Product/111222",
      title: "Standard Resin 3D Print",
      price: {
        amount: 49.99,
        currencyCode: "USD",
        formatted: "$49.99"
      }
    }
  });

  // 7. business_case
  console.log("💼 Seeding Business Case...");
  await db.business_case.create({
    data: {
      id: BUSINESS_CASE_ID,
      userId: INTERNAL_USER_ID,
      creationId: CREATION_ID,
      action: BusinessCaseAction.DIRECT_ORDER,
      status: BusinessCaseStatus.PAID,
      inputs: [
        {
          type: ArtifactType.IMAGE,
          url: "https://picsum.photos/seed/reference/800/800",
          label: "Input Image"
        }
      ],
      outputs: [
        {
          type: ArtifactType.MESH,
          url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/402002f196828a9539efd28748cd7c9d96c93cd2/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
          label: "Final Mesh"
        }
      ],
      commercials: [
        {
          id: "quote_001",
          currency: "USD",
          totalPrice: 49.99,
          status: CommercialQuoteStatus.ACCEPTED,
          items: [
            {
              productId: "gid://shopify/Product/111222",
              productTitle: "Standard Resin 3D Print",
              quotedPrice: 49.99,
              quotedCurrency: "USD",
              storePrice: 49.99,
              storeCurrency: "USD",
              quantity: 1,
              discountPercentage: 0,
              shopifyVariantId: VARIANT_ID
            }
          ],
          discountPercentage: 0
        }
      ],
      acceptedQuoteId: "quote_001",
      referenceOrderId: "gid://shopify/Order/4401",
      referenceOrderType: ReferenceOrderType.SHOPIFY,
      version: 1,
      lastUpdated: Date.now()
    }
  });

  // 8. shopify_order
  console.log("📦 Seeding Shopify Order Reference...");
  await db.shopify_order.create({
    data: {
      id: "gid://shopify/Order/4401",
      orderNumber: 4401,
      businessCaseId: BUSINESS_CASE_ID,
      totalPrice: "49.99",
      currency: "USD",
      financialStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      createdAt: new Date().toISOString()
    }
  });

  // 9. workorder
  console.log("🛠️ Seeding Work Order...");
  await db.workorder.create({
    data: {
      id: WORK_ORDER_ID,
      businessCaseId: BUSINESS_CASE_ID,
      creationId: CREATION_ID,
      type: WorkOrderType.MESH_PRINT,
      status: WorkOrderStatus.IN_PROGRESS, // Status: PRINTING (mapped to IN_PROGRESS)
      inputs: [],
      outputs: [
        {
          type: ArtifactType.MESH,
          url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/402002f196828a9539efd28748cd7c9d96c93cd2/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
          label: "Damaged Helmet GLB"
        }
      ],
      delivery: {
        type: DeliveryType.PHYSICAL,
        address: {
          name: "Abhinav GodMode",
          line1: "123 Metaverse Lane",
          city: "Neo Tokyo",
          postalCode: "100-0001",
          country: "Japan"
        }
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  });

  // 10. conversation
  console.log("💬 Seeding Conversation...");
  await db.conversation.create({
    data: {
      id: "msg_001",
      referenceId: WORK_ORDER_ID,
      referenceType: ConversationReferenceType.WORK_ORDER,
      authorName: "System Artist",
      role: ConversationRole.ARTIST,
      content: "Artist Note: The mesh has been optimized for resin printing. Support structures added.",
      attachments: [],
      createdAt: Date.now(),
      version: 1
    }
  });

  // 11. notification (User)
  console.log("🔔 Seeding User Notification...");
  await db.notification.create({
    data: {
      id: "notif_user_001",
      userId: INTERNAL_USER_ID,
      type: NotificationType.WORKORDER_STARTED,
      title: "Order Update",
      message: "Your order is now printing!",
      url: `/work-orders/${WORK_ORDER_ID}`,
      referenceType: "WORK_ORDER",
      referenceId: WORK_ORDER_ID,
      aggregationCount: 1,
      eventId: "evt_wo_start_001",
      priority: NotificationPriority.IMPORTANT,
      isRead: false,
      sourceDomain: "workorder",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1
    }
  });

  // 12. notification (Admin/Internal)
  console.log("🛡️ Seeding Admin Notification...");
  await db.notification.create({
    data: {
      id: "notif_admin_001",
      userId: INTERNAL_USER_ID, // Assuming same user for mock admin
      type: NotificationType.NEW_MESSAGE,
      title: "Internal Log",
      message: `Work Order ${WORK_ORDER_ID} transitioned to PRINTING status.`,
      url: `/admin/work-orders/${WORK_ORDER_ID}`,
      referenceType: "WORK_ORDER",
      referenceId: WORK_ORDER_ID,
      aggregationCount: 1,
      eventId: "evt_admin_log_001",
      priority: NotificationPriority.INFO,
      isRead: true,
      sourceDomain: "system",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1
    }
  });

  console.log("✅ 12-Domain Master Seed Sequence Complete!");
}
