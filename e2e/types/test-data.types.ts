export interface UserRegistrationData {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   country: string;
   city: string;
   address: string;
   zipCode: string;
   phone: string;
}

export interface ProductInfo {
   name: string;
   price: number;
}

export interface BillingAddress {
   country: string;
   city: string;
   address: string;
   zipCode: string;
   phone: string;
}