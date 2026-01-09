package mq

import (
	"crypto/tls"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/IBM/sarama"
	"github.com/zeromicro/go-zero/core/logx"
)

var _kafkaClient sarama.SyncProducer

type KqConf struct {
	Brokers  []string `json:",env=KAFKA_BROKERS"`
	Group    string   `json:",env=KAFKA_GROUP"`
	CaFile   string   `json:",optional,env=KAFKA_CAFILE"`
	Username string   `json:",optional,env=KAFKA_USERNAME"`
	Password string   `json:",optional,env=KAFKA_PASSWORD"`
}

type accessLogEntry struct {
	encoded []byte
}

func (ale *accessLogEntry) Length() int {
	return len(ale.encoded)
}

func (ale *accessLogEntry) Encode() ([]byte, error) {
	return ale.encoded, nil
}

func NewKafka(conf KqConf) sarama.SyncProducer {
	var err error
	_kafkaClient, err = newAccessLogProducer(conf.Brokers, conf.CaFile, conf.Username, conf.Password)
	if err != nil || _kafkaClient == nil {
		logx.Errorf("_kafkaClient Start error: %v", err)
		// panic("_kafkaClient Start error")
	}
	return _kafkaClient
}
func SendEventLogKafkaInfoMessage(topic string, key string, data []byte) error {
	if _kafkaClient == nil {
		return errors.New("_kafkaClient is Nil")
	}

	message := &sarama.ProducerMessage{
		Topic: topic,
		Key:   &accessLogEntry{encoded: []byte(key)},
		Value: &accessLogEntry{encoded: data},
	}

	p, o, err := _kafkaClient.SendMessage(message)
	if err != nil {
		logx.Errorf("[kafka] send event log to kafka failed: error:%v", err)
		return err
	}
	logx.Infof("[kafka] send event log to kafka success: %v:%v:%v, %v, len(data): %v",
		topic, p, o, key, len(data))
	return nil
}

func newAccessLogProducer(brokers []string, _, username, password string) (sarama.SyncProducer, error) {
	config := sarama.NewConfig()

	// Network related configurations
	config.Net.DialTimeout = 30 * time.Second
	config.Net.ReadTimeout = 30 * time.Second
	config.Net.WriteTimeout = 30 * time.Second
	config.Net.KeepAlive = 30 * time.Second

	sarama.Logger = log.New(os.Stdout, "[sarama] ", log.LstdFlags)
	config.Producer.Timeout = time.Second              // Producer timeout
	config.Producer.MaxMessageBytes = 1024 * 1024 * 10 // Max message size: 10MB
	config.Producer.Partitioner = sarama.NewHashPartitioner
	config.Metadata.AllowAutoTopicCreation = true

	// Retry configurations
	config.Producer.Retry.Max = 3
	config.Producer.Retry.Backoff = 100 * time.Millisecond
	config.Producer.Return.Errors = true

	// Enable TLS
	config.Net.TLS.Enable = false
	config.Net.TLS.Config = &tls.Config{
		InsecureSkipVerify: true, // WARNING: for test only!
	}

	config.Net.MaxOpenRequests = 1024

	config.ChannelBufferSize = 256

	// SASL configurations - only enable if username and password are provided
	if username != "" && password != "" {
		config.Net.SASL.Enable = true
		config.Net.SASL.Mechanism = sarama.SASLTypePlaintext
		config.Net.SASL.User = username
		config.Net.SASL.Password = password
	} else {
		config.Net.SASL.Enable = false
	}
	config.Producer.Return.Successes = true

	config.ClientID = "producer-dex-consumer"

	// config.Version = sarama.V3_0_0_0

	producer, err := sarama.NewSyncProducer(brokers, config)
	if err != nil {
		logx.Errorf("newAccessLogProducer error: %v", err)
		return nil, err
	}
	// print the producer
	fmt.Println("producer  connect success")

	return producer, nil
}
