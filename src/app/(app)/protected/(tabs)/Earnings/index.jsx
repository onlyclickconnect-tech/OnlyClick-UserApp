import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import useDimension from "../../../../../hooks/useDimensions";
import { Dropdown } from "react-native-element-dropdown";
import TransactionCard from "../../../../../components/Earnings/TransactionCard";
import { useModal } from "../../../../../context/ModalProvider";

export default function Earnings() {
  const [search, setSearch] = useState("");
  const { screenHeight, screenWidth } = useDimension();
  const { setIsAutoPayoutModalOpen, setIsWithdrawModalOpen } = useModal();

  const filters = [
    {
      Status: [
        { label: "Pending", value: "Pending" },
        { label: "Completed", value: "Completed" },
      ],
    },
    {
      Interval: [
        { label: "Daily", value: "Daily" },
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" },
      ],
    },
    {
      Type: [
        { label: "Withdrawn", value: "Withdrawn" },
        { label: "Received", value: "Received" },
      ],
    },
  ];
  const data = {
    availableBalance: 4500,
    totalWithdrawn: 7000,
    totalEarned: 11500,
    autoPayoutAmount: 5000,
    bankDetails: {
      bankName: "BANK OF DHOLAKPUR",
      accountNumber: "XXXXXX-0567",
    },
    transactions: [
      {
        month: "June",
        year: 2025,
        total: 6500,
        entries: [
          {
            name: "Suresh Dara",
            image: "https://picsum.photos/200/300?random=1",
            service: "Cupboard Fixing",
            date: "5 June",
            amount: 239,
            type: "credit",
          },
          {
            name: "Withdrawn",
            image: "https://picsum.photos/200/300?random=2",
            service: "TO BANK OF DHOLAKPUR",
            date: "5 June",
            amount: "XYZ",
            type: "debit",
          },
          {
            name: "Customer Name",
            image: "https://picsum.photos/200/300?random=3",
            service: "Service Name",
            date: "4 June",
            amount: "XYZ",
            type: "credit",
          },
          {
            name: "Customer Name",
            image: "https://picsum.photos/200/300?random=4",
            service: "Service Name",
            date: "3 June",
            amount: "XYZ",
            type: "credit",
          },
          {
            name: "Customer Name",
            image: "https://picsum.photos/200/300?random=5",
            service: "Service Name",
            date: "1 June",
            amount: "XYZ",
            type: "credit",
          },
        ],
      },
      {
        month: "May",
        year: 2025,
        total: 5000,
        entries: [
          {
            name: "Customer Name",
            image: "https://picsum.photos/200/300?random=6",
            service: "Service Name",
            date: "31 May",
            amount: "XYZ",
            type: "credit",
          },
        ],
      },
    ],
  };

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{
        paddingVertical: 20,
      }}
    >
      {/* 1st box */}
      <View
        style={{
          height: 170,
          justifyContent: "flex-end",
          gap: 20,
          paddingHorizontal: 30,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderColor: "#b3b3b3",
        }}
      >
        <View style={{ width: "100%" }}>
          <TextInput
            style={{
              backgroundColor: "white",
              paddingHorizontal: 20,
              borderRadius: 20,
              paddingLeft: 40,
              borderWidth: 2,
              borderColor: "#b3b3b3",
              fontWeight: "bold",
            }}
            numberOfLines={1}
            value={search}
            placeholderTextColor={"#b3b3b3"}
            placeholder="Search transactions"
            enterKeyHint="search"
            onChangeText={(e) => {
              console.log(e);
              setSearch(e);
            }}
          />
        </View>

        <View
          style={{
            height: 40,
            width: "100%",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Available Balance:
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "green" }}>
              Rs. {data.availableBalance}
            </Text>
          </View>
        </View>
      </View>

      {/* 2nd box */}

      <View
        style={{
          height: screenHeight * 0.31,
          top: 15,
          width: screenWidth,
          // marginBottom: 20,
          // paddingHorizontal: 15,
        }}
      >
        {/* 2 buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsWithdrawModalOpen(true);
            }}
            style={{
              width: "40%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              backgroundColor: "#3898b3",
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "white" }}>Withdraw Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsAutoPayoutModalOpen(true);
            }}
            style={{
              width: "40%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "#3898b3",
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "#3898b3", fontWeight: "bold" }}>
              Auto Payout
            </Text>
          </TouchableOpacity>
        </View>

        {/* datas */}
        <View style={{ paddingHorizontal: 15, top: 15 }}>
          {/* 3 datas */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Total Amount Withdrawn:</Text>
            <Text style={{ fontWeight: "bold" }}>
              Rs. {data.totalWithdrawn}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Total Amount Earned:</Text>
            <Text style={{ fontWeight: "bold" }}>Rs. {data.totalEarned}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Auto Payout Amount:</Text>
            <Text style={{ fontWeight: "bold" }}>
              Rs. {data.autoPayoutAmount}
            </Text>
          </View>

          {/* bank info */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 12, color: "#b3b3b3" }}>
              {data.bankDetails.bankName}
            </Text>
            <View>
              <Text style={{ fontWeight: 500, fontSize: 12, color: "#b3b3b3" }}>
                Acc No. {data.bankDetails.accountNumber}
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    color: "#3898b3",
                    fontSize: 11.5,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3 drop downs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              top: 10,
              height: 33,
              width: screenWidth * 0.9,
            }}
          >
            {filters.map((item, index) => {
              // const labels;
              console.log(item);
              const placeholder = Object.keys(item)[0];
              const data = Object.values(item)[0];
              console.log(data);
              return (
                <Dropdown
                  key={index}
                  placeholder={placeholder}
                  data={data}
                  labelField="label"
                  selectedTextStyle={{
                    fontSize: 11,
                    fontWeight: "bold",
                    volor: "#b3b3b3",
                    textAlign: "center",
                  }}
                  onChange={(item) => {
                    console.log(item);
                  }}
                  itemTextStyle={{ fontSize: 12, fontWeight: "bold" }}
                  valueField="value"
                  placeholderStyle={{
                    fontSize: 13,
                    textAlign: "center",
                    color: "#b3b3b3",
                    fontWeight: "bold",
                  }}
                  style={{
                    width: "30%",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#B3B3B3",
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>

      {data.transactions.map((data, key) => {
        return <TransactionCard key={key} data={data} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
