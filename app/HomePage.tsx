import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PropsCoustm {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function Home() {
  const [useLoding] = useFonts({
    Font2: require("../font/MomoTrustDisplay-Regular.ttf"),
  });
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;
  const taxiImageScale = useRef(new Animated.Value(0.8)).current;
  const taxiImageOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [progres, setProgres] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 300,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(taxiImageScale, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(taxiImageOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const progresInterval = setInterval(() => {
      setProgres((prev) => {
        if (prev >= 100) {
          clearInterval(progresInterval);
          setTimeout(() => {
            router.push({
              pathname: "/mapApplication",
              params: { name: "Youssef" },
            });
            setLoading(false);
          }, 500);

          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(progresInterval);
  }, []);

  const CustomText = ({ children, style }: PropsCoustm) => (
    <View>
      <Text
        style={[
          {
            fontFamily: "Font2",
            fontSize: 17,
            marginVertical: 10,
            color: "#fff",
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: "#b91e1eff", flex: 1 }}>
        <View style={styles.container}>
          <Animated.View
            style={{
              transform: [{ scale: logoScale }, { rotate: spin }],
            }}
          >
            <Image
              source={require("../assets/images/Taxi_business_logo____Premium_Vector-removebg-preview.png")}
              style={{ width: 300, height: 100 }}
            />
          </Animated.View>
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <CustomText style={{ fontSize: 40, textAlign: "center" }}>
              Your Taxi
            </CustomText>
          </Animated.View>

          <Animated.View
            style={{
              opacity: taxiImageOpacity,
              transform: [{ scale: taxiImageScale }],
            }}
          >
            <Image
              source={require("../assets/images/TaxiHome.png")}
              style={{ width: 400, height: 300 }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}
          >
            {/* <TouchableOpacity
              style={{
                backgroundColor: "#20770eff",
                width: 300,
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              onPress={() => router.push}
              activeOpacity={0.8}
            >
              <CustomText style={{ textAlign: "center", fontSize: 20 }}>
                Bienvenue
              </CustomText>
            </TouchableOpacity> */}
          </Animated.View>

          <View
            style={{
              width: 300,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 2,
              marginTop: 30,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progres}%`,
                height: "100%",
                backgroundColor: "#20770eff",
                borderRadius: 2,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  // return (
  //   <SafeAreaView style={{ backgroundColor: "#b91e1eff", flex: 1 }}>
  //     <View style={styles.container}>
  //       <CustomText style={{ fontSize: 30 }}>Main App Content</CustomText>
  //     </View>
  //   </SafeAreaView>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  Text: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
