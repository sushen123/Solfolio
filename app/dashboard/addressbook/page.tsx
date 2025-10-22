import { AddressBookList } from "@/components/address-book-list"

export default function AddressBookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Address Book</h1>
        <p className="text-muted-foreground">Save and manage your frequently used wallet addresses for quick access</p>
      </div>

      <AddressBookList />
    </div>
  )
}
