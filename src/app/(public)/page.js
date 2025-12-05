"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, Row, Typography } from "antd";
import Image from "next/image";
import { HOMEPAGE_FEATURES } from "@/utils/constants";
const { Title, Paragraph } = Typography;

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <>
      <main
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-gradiend.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <Row className="relative z-10 w-full p-6 lg:p-8 xl:p-10 pt-24 lg:pt-28 xl:pt-32">
          <Col xs={24} md={12}>
            <div className="w-full p-6 lg:p-8 xl:p-10">
              <Title className="text-4xl! sm:text-5xl! md:text-4xl! lg:text-5xl! xl:text-6xl! font-bold! leading-tight! text-white! drop-shadow">
                Power your
                <br />
                AI-powered legal research
                <br />
                and consultancy
              </Title>
              <Paragraph className="mt-4 text-xl! text-gray-100! drop-shadow">
                Ask complex legal questions in your own words, discover trusted
                documents instantly, and manage your clients and cases — all
                with AI at your side.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="w-full rounded-lg">
              <Image
                src="/main-banner.png"
                alt="AI Document Search Illustration"
                width={1200}
                height={1200}
                className="w-full h-auto rounded-xl shadow-md"
                priority
              />
            </div>
          </Col>
        </Row>
      </main>

      <section className="bg-gray-200 py-16 px-6">
        <Row className="mb-20 text-center" justify="center" align="middle">
          <Col xs={24} md={16} lg={10}>
            <Title level={1}>Centralize Your Legal Practice</Title>
            <Paragraph className="text-lg">
              Manage and streamline your entire legal operation from a single
              AI-powered platform, with efficiency and precision.
            </Paragraph>
          </Col>
        </Row>
        <div className="max-w-[1280px] mx-auto space-y-32">
          {HOMEPAGE_FEATURES.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <Row key={feature.title} gutter={[40, 40]} align="middle">
                {isEven ? (
                  <>
                    <Col
                      xs={24}
                      md={12}
                      className="flex flex-col justify-center"
                    >
                      <Title level={1}>{feature.title}</Title>
                      <Paragraph className="text-lg">
                        {feature.description}
                      </Paragraph>
                    </Col>
                    <Col
                      xs={24}
                      md={12}
                      className="flex justify-center md:justify-end"
                    >
                      <div className="w-full max-w-[620px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width={620}
                          height={320}
                          className="w-[620px] h-auto object-contain"
                        />
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col
                      xs={24}
                      md={12}
                      className="flex justify-center md:justify-start"
                    >
                      <div className="w-full max-w-[600px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width={620}
                          height={320}
                          className="w-[620px] h-auto object-contain"
                        />
                      </div>
                    </Col>
                    <Col
                      xs={24}
                      md={12}
                      className="flex flex-col justify-center"
                    >
                      <Title level={1}>{feature.title}</Title>
                      <Paragraph className="text-lg">
                        {feature.description}
                      </Paragraph>
                    </Col>
                  </>
                )}
              </Row>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Home;
