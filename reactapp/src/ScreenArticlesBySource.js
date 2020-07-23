import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Icon, Modal } from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux'

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  const [articleList, setArticleList] = useState([])

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const findArticles = async () => {

      const data = await fetch(`/articlesbysources?id=${props.match.params.id}`)
      const body = await data.json()
      console.log(body)
      setArticleList(body.articles)
    }

    findArticles()
  }, [])
  console.log(props.match.params.id)

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var saveArticle = async article => {
    props.addToWishList(article)

    const saveReq = await fetch('/wishlist-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${article.title}&content=${article.content}&desc=${article.description}&lang=${props.selectedLang}&img=${article.urlToImage}&token=${props.token}`
    })
  }

  return (
    <div>

      <Nav />

      <div className="Banner" />

      <div className="Card">
        {articleList.map((article, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>

            <Card

              style={{
                width: 300,
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              cover={
                <img
                  alt="example"
                  src={article.urlToImage}
                />
              }
              actions={[
                <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
                <Icon type="like" key="ellipsis" onClick={() => { saveArticle(article) }} />
              ]}
            >

              <Meta
                title={article.title}
                description={article.description}
              />

            </Card>
            <Modal
              title={title}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{title}</p>
            </Modal>

          </div>

        ))}
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function (article) {
      dispatch({
        type: 'addArticle',
        articleLiked: article
      })
    }
  }
}

function mapStateToProps(state) {
  return { token: state.token, selectedLang: state.selectedLang }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource)
