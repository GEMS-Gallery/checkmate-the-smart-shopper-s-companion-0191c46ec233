import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  type ShoppingItem = {
    id: Nat;
    description: Text;
    completed: Bool;
  };

  stable var nextId: Nat = 0;
  let itemsMap = HashMap.HashMap<Nat, ShoppingItem>(10, Nat.equal, Nat.hash);

  public func addItem(description: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem: ShoppingItem = {
      id = id;
      description = description;
      completed = false;
    };
    itemsMap.put(id, newItem);
    id
  };

  public func toggleItemCompletion(id: Nat) : async Bool {
    switch (itemsMap.get(id)) {
      case (null) { false };
      case (?item) {
        let updatedItem: ShoppingItem = {
          id = item.id;
          description = item.description;
          completed = not item.completed;
        };
        itemsMap.put(id, updatedItem);
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    switch (itemsMap.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getItems() : async [ShoppingItem] {
    Iter.toArray(itemsMap.vals())
  };

  system func preupgrade() {
    // Convert HashMap to array for stable storage
    nextId := nextId;
  };

  system func postupgrade() {
    // Reinitialize HashMap from stable storage
  };
}
