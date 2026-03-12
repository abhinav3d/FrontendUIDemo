export type Address = {
  id: string;

  firstName: string | null;
  lastName: string | null;

  company: string | null;

  address1: string | null;
  address2: string | null;

  city: string | null;

  zoneCode: string | null;       // State / Province
  territoryCode: string | null;  // Country code (US, IN, etc)

  zip: string | null;

  phoneNumber: string | null;
};

export type Customer = {
  id: string; //This is the Shopify customer ID, not the database ID

  firstName: string | null;
  lastName: string | null;

  emailAddress: {
    emailAddress: string;
  } | null;

  defaultAddress: Address | null;

  addresses: {
    nodes: Address[];
  };
};
