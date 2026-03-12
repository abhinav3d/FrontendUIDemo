export interface StyleGroup {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  styleTemplateIds: string[];
}

export interface StyleTemplate {
  id: string;
  name: string;
  thumbnailUrl: string;
  groupId: string;
  styleKey: string;
  styleDisplayName: string;
  aiCoinCost: number;
  aiWorkflowSpec: {
    inputPolicy: {
      subject: string;
    };
  };
}

export const STYLE_DATA = {
  groups: [
    {
      "id": "gid://shopify/Collection/479045746916",
      "slug": "pets",
      "name": "Pets",
      "description": "Transform your beloved companions into museum-grade 3D sculptures.",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/collections/pet-dog-and-cat.png?v=1772269853",
      "styleTemplateIds": [
        "gid://shopify/Product/8934244810980",
        "gid://shopify/Product/8934240911588",
        "gid://shopify/Product/8934239895780",
        "gid://shopify/Product/8934238028004",
        "gid://shopify/Product/8934237208804",
        "gid://shopify/Product/8934236192996",
        "gid://shopify/Product/8934221807844",
        "gid://shopify/Product/8934220169444",
        "gid://shopify/Product/8934218465508",
        "gid://shopify/Product/8934215418084",
        "gid://shopify/Product/8934213681380",
        "gid://shopify/Product/8934208045284",
        "gid://shopify/Product/8934202441956",
        "gid://shopify/Product/8934196707556",
        "gid://shopify/Product/8934182486244"
      ]
    },
    {
      "id": "gid://shopify/Collection/479343444196",
      "slug": "humans",
      "name": "Humans",
      "description": "Capture the essence of your loved ones with high-fidelity digital artistry.",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/collections/game_character_semi_real.png?v=1772269838",
      "styleTemplateIds": [
        "gid://shopify/Product/8933989712100",
        "gid://shopify/Product/8933989679332",
        "gid://shopify/Product/8933989548260",
        "gid://shopify/Product/8933989515492",
        "gid://shopify/Product/8933989122276",
        "gid://shopify/Product/8933988991204",
        "gid://shopify/Product/8933987713252",
        "gid://shopify/Product/8923666907364"
      ]
    }
  ],
  templates: [
    {
      "id": "gid://shopify/Product/8934244810980",
      "name": "Pets: Royal Style",
      "thumbnailUrl": "https://picsum.photos/seed/royal/800/800",
      "groupId": "gid://shopify/Collection/479045746916",
      "styleKey": "PETS-ROYAL-STYLE",
      "styleDisplayName": "Pets: Royal Style",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "pet" } }
    },
    {
      "id": "gid://shopify/Product/8934240911588",
      "name": "Pets: Luxury Matte Gold",
      "thumbnailUrl": "https://picsum.photos/seed/gold/800/800",
      "groupId": "gid://shopify/Collection/479045746916",
      "styleKey": "PETS-LUXURY-MATTE-GOLD",
      "styleDisplayName": "Pets: Luxury Matte Gold",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "pet" } }
    },
    {
      "id": "gid://shopify/Product/8934239895780",
      "name": "Pets: Claymation Style",
      "thumbnailUrl": "https://picsum.photos/seed/clay/800/800",
      "groupId": "gid://shopify/Collection/479045746916",
      "styleKey": "PETS-CLAYMATION-STYLE",
      "styleDisplayName": "Pets: Claymation Style",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "pet" } }
    },
    {
      "id": "gid://shopify/Product/8934238028004",
      "name": "Pets: Cyberpunk Neon",
      "thumbnailUrl": "https://picsum.photos/seed/cyberpet/800/800",
      "groupId": "gid://shopify/Collection/479045746916",
      "styleKey": "PETS-CYBERPUNK-NEON-STYLE",
      "styleDisplayName": "Pets: Cyberpunk Neon Style",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "pet" } }
    },
    {
      "id": "gid://shopify/Product/8933989712100",
      "name": "Fantasy Hero",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/Fantasyhero.jpg?v=1772188970",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "FANTASY-HERO",
      "styleDisplayName": "Fantasy Hero",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933989679332",
      "name": "Cyberpunk",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/cyberpunk.jpg?v=1772188238",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "CYBERPUNK",
      "styleDisplayName": "Cyberpunk",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933989548260",
      "name": "Comic / Superhero",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/superhero_comicstyle.jpg?v=1772187690",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "COMIC-SUPERHERO",
      "styleDisplayName": "Comic / Superhero",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933989515492",
      "name": "Cel-Shaded",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/celgameanimecharacter.jpg?v=1772187338",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "CEL-SHADED",
      "styleDisplayName": "Cel-Shaded",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933989122276",
      "name": "Kawaii",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/image_3.png?v=1772182124",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "KAWAII",
      "styleDisplayName": "Kawaii",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933988991204",
      "name": "Chibi",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/Chibi.jpg?v=1772181850",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "CHIBI",
      "styleDisplayName": "Chibi",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8933987713252",
      "name": "Manga",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/MangaStyle.jpg?v=1772181629",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "MANGA",
      "styleDisplayName": "Manga",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    },
    {
      "id": "gid://shopify/Product/8923666907364",
      "name": "Anime 3D",
      "thumbnailUrl": "https://cdn.shopify.com/s/files/1/0795/1119/1780/files/Animestyle.jpg?v=1771594923",
      "groupId": "gid://shopify/Collection/479343444196",
      "styleKey": "ANIME-3D",
      "styleDisplayName": "Anime 3D",
      "aiCoinCost": 10,
      "aiWorkflowSpec": { "inputPolicy": { "subject": "human" } }
    }
  ]
};
